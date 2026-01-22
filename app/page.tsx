"use client";

import { useEffect, useState } from "react";
import { getWeb3 } from "@/lib/web3";
import { getContract } from "@/lib/contract";

/* ===== STATUS ENUM SAMA DENGAN SOLIDITY ===== */
const STATUS_LABEL = [
  "Requested",   // 0
  "Accepted",    // 1
  "Funded",      // 2
  "Completed",   // 3 (CompletedByDriver)
  "Finalized",   // 4
  "Cancelled",   // 5
];

const STATUS_COLORS: Record<number, string> = {
  0: "#f0ad4e", // Requested (amber)
  1: "#5bc0de", // Accepted (cyan)
  2: "#6f42c1", // Funded (purple)
  3: "#0275d8", // Completed (blue)
  4: "#5cb85c", // Finalized (green)
  5: "#d9534f", // Cancelled (red)
};

const BASE_FARE_ETH = 0.001;
const PER_KM_ETH = 0.0005;

/* ---------------- Small UI helpers ---------------- */
const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "24px auto",
  padding: "12px 18px",
  fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  color: "#e6eef8",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginBottom: 18,
};

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
  borderRadius: 10,
  padding: 14,
  boxShadow: "0 6px 22px rgba(2,6,23,0.4)",
  border: "1px solid rgba(255,255,255,0.04)",
};

const smallMuted: React.CSSProperties = {
  color: "rgba(255,255,255,0.55)",
  fontSize: 13,
};

function fmtEth(s: string) {
  if (!s) return "0";
  const n = Number(s);
  if (!isFinite(n)) return s;
  return Number(n).toFixed(4);
}

/* ---------------- Badge ---------------- */
function StatusBadge({ status }: { status: number }) {
  const label = STATUS_LABEL[status] ?? `Unknown(${status})`;
  const color = STATUS_COLORS[status] ?? "#999999";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: 999,
        background: `linear-gradient(180deg, ${color}33, ${color}22)`,
        color: "#fff",
        fontWeight: 600,
        fontSize: 13,
        border: `1px solid ${color}66`,
      }}
    >
      {label}
    </span>
  );
}

/* ---------------- Action Button ---------------- */
function ActionButton({
  children,
  onClick,
  disabled,
  full = true,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: full ? "100%" : undefined,
        padding: "12px 16px",
        borderRadius: 8,
        border: "none",
        background: disabled ? "linear-gradient(180deg,#222 0,#191919 100%)" : "linear-gradient(90deg,#6f6cfa,#7f52ff)",
        color: disabled ? "#9aa3b2" : "#fff",
        boxShadow: disabled ? "none" : "0 6px 18px rgba(111,108,250,0.18)",
        cursor: disabled ? "not-allowed" : "pointer",
        marginBottom: 10,
        fontWeight: 700,
        fontSize: 14,
      }}
    >
      {children}
    </button>
  );
}

/* ---------------- Main Page ---------------- */
export default function Page() {
  const [web3, setWeb3] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string>("");

  const [rides, setRides] = useState<any[]>([]);
  const [selectedRide, setSelectedRide] = useState<number | null>(null);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [distanceKm, setDistanceKm] = useState<number>(1);

  const [contractBalance, setContractBalance] = useState("0");
  const [walletBalance, setWalletBalance] = useState("0");

  /* ================= CONNECT ================= */
  useEffect(() => {
    (async () => {
      try {
        const w3 = await getWeb3();
        if (!w3) return;

        const accs = await w3.eth.getAccounts();
        if (!accs || accs.length === 0) return;

        const ctr = getContract(w3);

        setWeb3(w3);
        setAccount(accs[0]);
        setContract(ctr);

        await loadAll(ctr, w3, accs[0]);
      } catch (err) {
        console.error("connect error:", err);
      }
    })();
  }, []);

  /* ================= LISTENER AKUN & CHAIN METAMASK ================= */
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount("");
        setRides([]);
        return;
      }
      setAccount(accounts[0]);
      if (!web3 || !contract) return;
      const w3 = web3;
      await loadAll(contract, w3, accounts[0]);
    };

    const handleChainChanged = async (_chainId: string) => {
      if (!window.ethereum) return;
      try {
        const w3 = await getWeb3();
        if (!w3) return;
        setWeb3(w3);
        const ctr = getContract(w3);
        setContract(ctr);
        if (account) await loadAll(ctr, w3, account);
      } catch (err) {
        console.error("chainChange load error:", err);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [web3, contract, account]);

  /* ================= LOADERS ================= */
  const loadAll = async (ctr: any, w3: any, acct: string) => {
    try {
      const countBN = await ctr.methods.getRidesCount().call();
      const count = Number(countBN);
      const arr: any[] = [];

      for (let i = 0; i < count; i++) {
        const r = await ctr.methods.getRide(i).call();
        arr.push({
          id: i,
          pickup: r.pickup,
          destination: r.destination,
          status: Number(r.status),
          passenger: r.passenger,
          driver: r.driver,
          fareWei: r.fare ? r.fare.toString() : "0",
        });
      }
      setRides(arr);

      const cBal = await w3.eth.getBalance(ctr.options.address);
      const wBal = await w3.eth.getBalance(acct);
      setContractBalance(w3.utils.fromWei(cBal, "ether"));
      setWalletBalance(w3.utils.fromWei(wBal, "ether"));
    } catch (err) {
      console.error("loadAll error:", err);
    }
  };

  /* ================= HELPERS ================= */
  const computeFareEth = (km: number) => {
    const eth = BASE_FARE_ETH + PER_KM_ETH * km;
    return eth;
  };

  const computeFareWei = (km: number) => {
    if (!web3) return "0";
    const eth = computeFareEth(km);
    return web3.utils.toWei(eth.toString(), "ether");
  };

  const selectedStatus =
    selectedRide !== null ? rides.find(r => r.id === selectedRide)?.status ?? null : null;

  /* ================= ACTIONS ================= */

  const registerDriver = async () => {
    if (!contract || !web3 || !account) return alert("Wallet not connected");
    try {
      await contract.methods
        .registerDriver(
          "Driver A",
          "B1234XYZ",
          "Car",
          web3.utils.toWei("0.001", "ether")
        )
        .send({ from: account });
      await loadAll(contract, web3, account);
      alert("Driver registered");
    } catch (err) {
      console.error("registerDriver error:", err);
      alert("registerDriver failed: " + (err as any).message);
    }
  };

  const requestRide = async () => {
    if (!contract || !web3 || !account) return alert("Wallet not connected");
    if (!pickup || !destination) return alert("Pickup & destination required");
    try {
      const tx = await contract.methods
        .requestRide(pickup, destination, Math.max(1, Math.floor(distanceKm)))
        .send({ from: account });

      await loadAll(contract, web3, account);
      alert("Request submitted: " + (tx.transactionHash ?? "tx"));
    } catch (err) {
      console.error("requestRide error:", err);
      alert("requestRide failed: " + (err as any).message);
    }
  };

  const acceptRide = async () => {
    if (selectedRide === null || !contract || !web3 || !account) return;
    try {
      await contract.methods
        .acceptRide(selectedRide)
        .send({ from: account });
      await loadAll(contract, web3, account);
    } catch (err) {
      console.error("acceptRide error:", err);
      alert("acceptRide failed: " + (err as any).message);
    }
  };

  const fundRide = async () => {
    if (selectedRide === null || !contract || !web3 || !account) return;
    try {
      const fareWei = computeFareWei(distanceKm);
      await contract.methods
        .fundRide(selectedRide)
        .send({
          from: account,
          value: fareWei,
        });
      await loadAll(contract, web3, account);
    } catch (err) {
      console.error("fundRide error:", err);
      alert("fundRide failed: " + (err as any).message);
    }
  };

  const completeRide = async () => {
    if (selectedRide === null || !contract || !web3 || !account) return;
    try {
      await contract.methods
        .completeRide(selectedRide)
        .send({ from: account });
      await loadAll(contract, web3, account);
    } catch (err) {
      console.error("completeRide error:", err);
      alert("completeRide failed: " + (err as any).message);
    }
  };

  const confirmArrival = async () => {
    if (selectedRide === null || !contract || !web3 || !account) return;
    try {
      await contract.methods
        .confirmArrival(selectedRide)
        .send({ from: account });
      await loadAll(contract, web3, account);
    } catch (err) {
      console.error("confirmArrival error:", err);
      alert("confirmArrival failed: " + (err as any).message);
    }
  };

  /* ================= UI ================= */
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={{ margin: 0 }}>RideChain DApp</h2>
          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: 13, color: "#cfe6ff" }}>
              <strong>Account:</strong> {account || <span style={smallMuted}>not connected</span>}
            </div>
            <div style={smallMuted}><strong>Wallet Balance:</strong> {fmtEth(walletBalance)} ETH</div>
            <div style={smallMuted}><strong>Contract Balance:</strong> {fmtEth(contractBalance)} ETH</div>
          </div>
        </div>

        <div style={{ minWidth: 240 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#cfe6ff", marginBottom: 6 }}>Quick Actions</div>
            <div style={{ display: "grid", gap: 8 }}>
              <ActionButton onClick={registerDriver} disabled={!account}>Register Driver</ActionButton>
            </div>
          </div>
        </div>
      </div>

      {/* Request card */}
      <div style={{ ...cardStyle, marginBottom: 18 }}>
        <h3 style={{ marginTop: 0 }}>Request Ride</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
          <input placeholder="Pickup" value={pickup} onChange={(e) => setPickup(e.target.value)}
                 style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#fff" }} />
          <input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)}
                 style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#fff" }} />
          <input type="number" min={1} value={distanceKm} onChange={(e) => setDistanceKm(Number(e.target.value))}
                 style={{ width: 96, padding: 8, borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#fff", textAlign: "center" }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={smallMuted}>Estimated Fare:</div>
          <div style={{ marginTop: 2, fontWeight: 700 }}>{computeFareEth(distanceKm).toFixed(4)} ETH</div>
          <div style={{ ...smallMuted, marginTop: 6 }}>
            Funds will be held in the Escrow Contract and released to the driver after you confirm arrival.
          </div>
        </div>

        <ActionButton onClick={requestRide} disabled={!account}>Request Ride</ActionButton>
      </div>

      {/* Rides list */}
      <h3>Rides</h3>
      <div style={{ marginBottom: 12 }}>
        {rides.length === 0 && <div style={smallMuted}>No rides yet.</div>}
        {rides.map((r) => {
          const isSelected = selectedRide === r.id;
          return (
            <div
              key={r.id}
              onClick={() => setSelectedRide(r.id)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
                cursor: "pointer",
                background: isSelected ? "linear-gradient(90deg,#001022,#00172b)" : "transparent",
                border: isSelected ? "1px solid cyan" : "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>
                  #{r.id} — {r.pickup} → {r.destination} —{" "}
                  <span style={{ marginLeft: 8 }}>
                    <StatusBadge status={r.status} />
                  </span>
                </div>
                <div style={{ ...smallMuted, marginTop: 6 }}>
                  Passenger: {r.passenger} • Driver: {r.driver || <em>not assigned</em>}
                </div>
              </div>

              <div style={{ minWidth: 140, textAlign: "right" }}>
                <div style={{ marginBottom: 6, ...smallMuted }}>Fare</div>
                <div style={{ fontWeight: 800 }}>{fmtEth(web3?.utils?.fromWei?.(r.fareWei ?? "0", "ether") ?? "0")} ETH</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action buttons area */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
        <ActionButton onClick={acceptRide} disabled={selectedStatus !== 0}>Accept Ride</ActionButton>
        <ActionButton onClick={fundRide} disabled={selectedStatus !== 1}>Fund (Escrow)</ActionButton>
        <ActionButton onClick={completeRide} disabled={selectedStatus !== 2}>Complete Ride</ActionButton>
        <ActionButton onClick={confirmArrival} disabled={selectedStatus !== 3}>Confirm Arrival</ActionButton>
      </div>
    </div>
  );
}
