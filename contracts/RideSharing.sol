// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RideSharing {
    enum Status {
        Requested,
        Accepted,
        Funded,
        CompletedByDriver,
        Finalized,
        Cancelled
    }

    uint256 public constant BASE_FARE_WEI = 1e15;   // 0.001 ETH
    uint256 public constant PER_KM_WEI    = 5e14;   // 0.0005 ETH

    struct Driver {
        bool registered;
        string name;
        string plate;
        string vehicleType;
        uint256 rate;
    }

    struct Ride {
        address passenger;
        address driver;
        string pickup;
        string destination;
        uint256 distanceKm;   // <<< DISIMPAN ON-CHAIN
        uint256 fare;         // <<< DISIMPAN ON-CHAIN
        Status status;
        bool exists;
    }

    mapping(address => Driver) public drivers;
    mapping(uint256 => Ride) public rides;
    uint256 public rideCount;

    modifier rideExists(uint256 id) {
        require(id < rideCount && rides[id].exists, "Ride not found");
        _;
    }

    modifier onlyPassenger(uint256 id) {
        require(msg.sender == rides[id].passenger, "Not passenger");
        _;
    }

    modifier onlyDriver(uint256 id) {
        require(msg.sender == rides[id].driver, "Not driver");
        _;
    }

    function registerDriver(
        string calldata name,
        string calldata plate,
        string calldata vehicleType,
        uint256 rate
    ) external {
        require(!drivers[msg.sender].registered, "Already registered");
        drivers[msg.sender] = Driver(true, name, plate, vehicleType, rate);
    }

    function requestRide(
        string calldata pickup,
        string calldata destination,
        uint256 distanceKm
    ) external {
        require(distanceKm > 0, "Invalid distance");

        uint256 fare = BASE_FARE_WEI + (PER_KM_WEI * distanceKm);

        rides[rideCount] = Ride({
            passenger: msg.sender,
            driver: address(0),
            pickup: pickup,
            destination: destination,
            distanceKm: distanceKm,
            fare: fare,
            status: Status.Requested,
            exists: true
        });

        rideCount++;
    }

    function acceptRide(uint256 id) external rideExists(id) {
        require(drivers[msg.sender].registered, "Not driver");
        Ride storage r = rides[id];
        require(r.status == Status.Requested, "Not requestable");
        r.driver = msg.sender;
        r.status = Status.Accepted;
    }

    function fundRide(uint256 id) external payable rideExists(id) onlyPassenger(id) {
        Ride storage r = rides[id];
        require(r.status == Status.Accepted, "Not accepted");
        require(msg.value == r.fare, "Incorrect fare");
        r.status = Status.Funded;
    }

    function completeRide(uint256 id) external rideExists(id) onlyDriver(id) {
        Ride storage r = rides[id];
        require(r.status == Status.Funded, "Not funded");
        r.status = Status.CompletedByDriver;
    }

    function confirmArrival(uint256 id) external rideExists(id) onlyPassenger(id) {
        Ride storage r = rides[id];
        require(r.status == Status.CompletedByDriver, "Not completed");
        uint256 amount = r.fare;
        r.fare = 0;
        r.status = Status.Finalized;
        payable(r.driver).transfer(amount);
    }

    function getRidesCount() external view returns (uint256) {
        return rideCount;
    }

    function getRide(uint256 id)
        external
        view
        rideExists(id)
        returns (
            address passenger,
            address driver,
            string memory pickup,
            string memory destination,
            uint256 distanceKm,
            uint256 fare,
            Status status
        )
    {
        Ride storage r = rides[id];
        return (r.passenger, r.driver, r.pickup, r.destination, r.distanceKm, r.fare, r.status);
    }
}
