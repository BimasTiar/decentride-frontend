export default function Header({
  account,
  onConnect,
  onDisconnect,
}: {
  account: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <div className="card">
      <h1>RideChain</h1>
      {account ? (
        <>
          <p>Connected: {account}</p>
          <button className="secondary" onClick={onDisconnect}>
            Disconnect
          </button>
        </>
      ) : (
        <button onClick={onConnect}>Connect Wallet</button>
      )}
    </div>
  );
}
