"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import DriversSection from "@/components/DriversSection";
import RideRequestsSection from "@/components/RideRequestsSection";
import ActionPanel from "@/components/ActionPanel";
import { getWeb3 } from "@/lib/web3";
import { getContract } from "@/lib/contract";

export default function Page() {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [rides, setRides] = useState<any[]>([]);
  const [selectedRide, setSelectedRide] = useState<number | null>(null);

  const connect = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    setContract(getContract(web3));
  };

  const loadDrivers = async () => {
    const count = await contract.methods.getDriversCount().call();
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(await contract.methods.getDriverByIndex(i).call());
    }
    setDrivers(arr);
  };

  const loadRides = async () => {
    const count = await contract.methods.getRidesCount().call();
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(await contract.methods.getRide(i).call());
    }
    setRides(arr);
  };

  useEffect(() => {
    if (contract) {
      loadDrivers();
      loadRides();
    }
  }, [contract]);

  return (
    <div className="container">
      <Header
        account={account}
        onConnect={connect}
        onDisconnect={() => setAccount(null)}
      /> 

      {account && (
        <div className="grid">
          <DriversSection drivers={drivers} />
          <RideRequestsSection
            rides={rides}
            onSelect={setSelectedRide}
          />
          <ActionPanel
            onRequest={() =>
              contract.methods.requestRide("A", "B").send({ from: account })
            }
            onAccept={() =>
              selectedRide !== null &&
              contract.methods.acceptRide(selectedRide).send({ from: account })
            }
            onFund={() =>
              selectedRide !== null &&
              contract.methods.fundRide(selectedRide).send({
                from: account,
                value: "1000000000000000",
              })
            }
            onComplete={() =>
              selectedRide !== null &&
              contract.methods.completeRide(selectedRide).send({ from: account })
            }
            onConfirm={() =>
              selectedRide !== null &&
              contract.methods.confirmArrival(selectedRide).send({
                from: account,
              })
            }
          />
        </div>
      )}
    </div>
  );
}
