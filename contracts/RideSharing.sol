// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RideSharing {
    /* ===================== ENUM ===================== */
    enum Status {
        Requested,          // 0
        Accepted,           // 1
        Funded,             // 2
        CompletedByDriver,  // 3
        Finalized,          // 4
        Cancelled           // 5 (unused, reserved)
    }

    /* ===================== STRUCT ===================== */
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
        uint256 fare;
        Status status;
        bool exists;
    }

    /* ===================== STORAGE ===================== */
    mapping(address => Driver) public drivers;
    address[] public driverList;

    Ride[] public rides;

    uint256 public constant BASE_FARE = 0.001 ether;

    /* ===================== SECURITY ===================== */
    uint8 private locked = 1;
    modifier nonReentrant() {
        require(locked == 1, "Reentrant call");
        locked = 2;
        _;
        locked = 1;
    }

    modifier rideExists(uint256 id) {
        require(id < rides.length && rides[id].exists, "Ride not found");
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

    /* ===================== DRIVER ===================== */
    function registerDriver(
        string calldata name,
        string calldata plate,
        string calldata vehicleType,
        uint256 rate
    ) external {
        require(!drivers[msg.sender].registered, "Already registered");

        drivers[msg.sender] = Driver({
            registered: true,
            name: name,
            plate: plate,
            vehicleType: vehicleType,
            rate: rate
        });

        driverList.push(msg.sender);
    }

    function getDriversCount() external view returns (uint256) {
        return driverList.length;
    }

    function getDriverByIndex(uint256 index)
        external
        view
        returns (address driver, string memory name, uint256 rate)
    {
        address a = driverList[index];
        Driver storage d = drivers[a];
        return (a, d.name, d.rate);
    }

    /* ===================== RIDE ===================== */
    function requestRide(
        string memory pickup,
        string memory destination
    ) external {
        rides.push(
            Ride({
                passenger: msg.sender,
                driver: address(0),
                pickup: pickup,
                destination: destination,
                fare: BASE_FARE,
                status: Status.Requested,
                exists: true
            })
        );
    }

    function getRidesCount() external view returns (uint256) {
        return rides.length;
    }

    function getRideFare(uint256 rideId) external view returns (uint256) {
        require(rideId < rides.length, "Invalid ride id");
        return rides[rideId].fare;
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
            uint256 fare,
            Status status
        )
    {
        Ride storage r = rides[id];
        return (
            r.passenger,
            r.driver,
            r.pickup,
            r.destination,
            r.fare,
            r.status
        );
    }

    function acceptRide(uint256 id)
        external
        rideExists(id)
    {
        require(drivers[msg.sender].registered, "Not registered driver");

        Ride storage r = rides[id];
        require(r.status == Status.Requested, "Ride not requestable");

        r.driver = msg.sender;
        r.status = Status.Accepted;
    }

    function fundRide(uint256 id)
        external
        payable
        rideExists(id)
    {
        Ride storage r = rides[id];

        require(r.status == Status.Accepted, "Ride not accepted");
        require(msg.sender == r.passenger, "Not passenger");
        require(msg.value == r.fare, "Incorrect fare amount");

        r.status = Status.Funded;
    }

    function completeRide(uint256 id)
        external
        rideExists(id)
        onlyDriver(id)
    {
        Ride storage r = rides[id];
        require(r.status == Status.Funded, "Ride not funded");

        r.status = Status.CompletedByDriver;
    }

    function confirmArrival(uint256 id)
        external
        rideExists(id)
        onlyPassenger(id)
        nonReentrant
    {
        Ride storage r = rides[id];
        require(r.status == Status.CompletedByDriver, "Ride not completed");

        uint256 amount = r.fare;
        r.fare = 0;
        r.status = Status.Finalized;

        payable(r.driver).transfer(amount);
    }

    /* ===================== FALLBACK ===================== */
    receive() external payable {
        revert("Direct ETH not allowed");
    }
}
