"use client";

import { useState } from "react";
import Header from "@/components/Header";
import DriversSection from "@/components/DriversSection";
import RideRequestsSection from "@/components/RideRequestsSection";
import ActionPanel from "@/components/ActionPanel";
import { getWeb3, getContract } from "@/lib/web3";

export default function Page() {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [rides, setRides] = useState<any[]>([]);
  const [selectedRide, setSelectedRide] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const safeTx = async (fn: () => Promise<void>) => {
    try {
      setLoading(true);
      await fn();
    } catch (e: any) {
      if (e?.code !== 4001) console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window as any;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const web3 = getWeb3();
    const c = getContract(web3);
    setAccount(accounts[0]);
    setContract(c);
    loadRides(c);
  };

  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setRides([]);
  };

  const loadRides = async (c: any) => {
    const count = await c.methods.getRidesCount().call();
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(await c.methods.getRide(i).call());
    }
    setRides(list);
  };

  return (
    <>
      <Header account={account} onConnect={connectWallet} onLogout={disconnectWallet} />

      {account && (
        <main className="layout">
          <div>
            <DriversSection drivers={[]} />
            <div style={{ height: 16 }} />
            <RideRequestsSection
              rides={rides}
              selectedRide={selectedRide}
              onSelectRide={setSelectedRide}
            />
          </div>

          <ActionPanel
            disabled={loading || selectedRide === null}
            onRequest={() => safeTx(() => contract.methods.requestRide("A","B").send({ from: account }))}
            onAccept={() => safeTx(() => contract.methods.acceptRide(selectedRide).send({ from: account }))}
            onFund={() => safeTx(() => contract.methods.fundRide(selectedRide).send({ from: account, value: "1000000000000000" }))}
            onComplete={() => safeTx(() => contract.methods.completeRide(selectedRide).send({ from: account }))}
            onConfirm={() => safeTx(() => contract.methods.confirmArrival(selectedRide).send({ from: account }))}
          />
        </main>
      )}
    </>
  );
}
