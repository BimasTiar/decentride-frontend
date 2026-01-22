export default function Header({
  account,
  onConnect,
  onDisconnect,
  onSync,
  contractBalance,
}: {
  account: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  contractBalance?: string;
}) {
  return (
    <div className="card">
      <h1>RideChain</h1>

      {account ? (
        <>
          <p style={{ marginBottom: 8 }}>Connected: {account}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="secondary" onClick={onDisconnect}>
              Disconnect
            </button>
            <button onClick={onSync}>Sync Now</button>
          </div>
          <div style={{ marginTop: 8, fontSize: 13 }}>
            Contract balance: {contractBalance ?? "0"} ETH
          </div>
        </>
      ) : (
        <>
          <button onClick={onConnect}>Connect Wallet</button>
          <div style={{ marginTop: 8, fontSize: 13 }}>Not connected</div>
        </>
      )}
    </div>
  );
}
