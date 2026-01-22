type Props = {
  account: string | null;
  onConnect: () => void;
  onLogout: () => void;
};

export default function Header({ account, onConnect, onLogout }: Props) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "16px 24px",
      borderBottom: "1px solid rgba(255,255,255,0.1)"
    }}>
      <h2>RideChain</h2>

      {account ? (
        <div style={{ display: "flex", gap: 12 }}>
          <span>{account.slice(0,6)}…{account.slice(-4)}</span>
          <button className="secondary" onClick={onLogout}>Disconnect</button>
        </div>
      ) : (
        <button className="primary" onClick={onConnect}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}
