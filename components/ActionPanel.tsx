export default function ActionPanel(props: {
  onRegister: () => Promise<void>;
  onRequest: () => Promise<void>;
  onAccept: () => Promise<void>;
  onFund: () => Promise<void>;
  onComplete: () => Promise<void>;
  onConfirm: () => Promise<void>;
}) {
  return (
    <div className="card">
      <button onClick={props.onRegister}>
        Register Driver
      </button>

      <button onClick={props.onRequest}>
        Request Ride
      </button>

      <button onClick={props.onAccept}>
        Accept Ride
      </button>

      <button onClick={props.onFund}>
        Fund (Escrow)
      </button>

      <button onClick={props.onComplete}>
        Complete Ride
      </button>

      <button onClick={props.onConfirm}>
        Confirm Arrival
      </button>
    </div>
  );
}
