"use client";

import { useEffect, useState } from "react";
import { getWeb3 } from "@/lib/web3";
import { getContract } from "@/lib/contract";

const STATUS_LABEL = [
  "Requested",   // 0
  "Accepted",    // 1
  "Funded",      // 2
  "Completed",   // 3
  "Finalized",   // 4
];

const BASE_FARE_ETH = 0.001;
const PER_KM_ETH = 0.0005;

export default function Page() {
  const [web3, setWeb3] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);

  const [rides, setRides] = useState<any[]>([]);
  const [selectedRide, setSelectedRide] = useState<number | null>(null);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [distanceKm, setDistanceKm] = useState(1);

  const [contractBalance, setContractBalance] = useState("0");
  const [walletBalance, setWalletBalance] = useState("0");

  /* ================= CONNECT ================= */
  useEffect(() => {
    (async () => {
      const w3 = await getWeb3();
      if (!w3) return;

      const accs = await w3.eth.getAccounts();
      const ctr = getContract(w3);

      setWeb3(w3);
      setAccount(accs[0]);
      setContract(ctr);

      await loadAll(ctr, w3, accs[0]);
    })();
  }, []);

  const loadAll = async (ctr: any, w3: any, acct: string) => {
    const count = Number(await ctr.methods.getRidesCount().call());
    const arr = [];
    for (let i = 0; i < count; i++) {
      const r = await ctr.methods.getRide(i).call();
      arr.push({
        id: i,
        pickup: r.pickup,
        destination: r.destination,
        status: Number(r.status),
        passenger: r.passenger,
        driver: r.driver,
      });
    }
    setRides(arr);

    const cBal = await w3.eth.getBalance(ctr.options.address);
    const wBal = await w3.eth.getBalance(acct);
    setContractBalance(w3.utils.fromWei(cBal, "ether"));
    setWalletBalance(w3.utils.fromWei(wBal, "ether"));
  };

  const computeFareWei = (km: number) => {
    if (!web3) return "0";
    const eth = BASE_FARE_ETH + PER_KM_ETH * km;
    return web3.utils.toWei(eth.toString(), "ether");
  };

  const selectedStatus =
    selectedRide !== null ? rides[selectedRide]?.status : null;

  /* ================= ACTIONS ================= */
  const requestRide = async () => {
    await contract.methods
      .requestRide(pickup, destination)
      .send({ from: account });
    await loadAll(contract, web3, account!);
  };

  const acceptRide = async () => {
    if (selectedRide === null) return;
    await contract.methods
      .acceptRide(selectedRide)
      .send({ from: account });
    await loadAll(contract, web3, account!);
  };

  const fundRide = async () => {
    if (selectedRide === null) return;
    await contract.methods
      .fundRide(selectedRide)
      .send({
        from: account,
        value: computeFareWei(distanceKm),
      });
    await loadAll(contract, web3, account!);
  };

  const completeRide = async () => {
    if (selectedRide === null) return;
    await contract.methods
      .completeRide(selectedRide)
      .send({ from: account });
    await loadAll(contract, web3, account!);
  };

  const confirmArrival = async () => {
    if (selectedRide === null) return;
    await contract.methods
      .confirmArrival(selectedRide)
      .send({ from: account });
    await loadAll(contract, web3, account!);
  };

  /* ================= UI ================= */
  return (
    <div style={{ padding: 24 }}>
      <h2>RideChain</h2>
      <div>Account: {account}</div>
      <div>Contract: {contractBalance} ETH</div>
      <div>Wallet: {walletBalance} ETH</div>

      <hr />

      <h3>Request Ride</h3>
      <input placeholder="Pickup" onChange={e => setPickup(e.target.value)} />
      <input placeholder="Destination" onChange={e => setDestination(e.target.value)} />
      <input type="number" value={distanceKm} onChange={e => setDistanceKm(+e.target.value)} />
      <div>
        Estimated Fare:{" "}
        {web3
        ? Number(BASE_FARE_ETH + PER_KM_ETH * distanceKm).toFixed(4)
        : "0.0000"} ETH
      </div>
      
      <button onClick={requestRide}>Request Ride</button>

      <hr />

      <h3>Rides</h3>
      {rides.map(r => (
        <div
          key={r.id}
          onClick={() => setSelectedRide(r.id)}
          style={{
            border: selectedRide === r.id ? "2px solid cyan" : "1px solid gray",
            padding: 6,
            cursor: "pointer",
          }}
        >
          #{r.id} — {r.pickup} → {r.destination} —{" "}
          <b>{STATUS_LABEL[r.status]}</b>
        </div>
      ))}

      <hr />

      <button disabled={selectedStatus !== 0} onClick={acceptRide}>Accept Ride</button>
      <button disabled={selectedStatus !== 1} onClick={fundRide}>Fund (Escrow)</button>
      <button disabled={selectedStatus !== 2} onClick={completeRide}>Complete Ride</button>
      <button disabled={selectedStatus !== 3} onClick={confirmArrival}>Confirm Arrival</button>
    </div>
  );
}
