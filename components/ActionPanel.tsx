type Props = {
  disabled: boolean;
  onRequest: () => void;
  onAccept: () => void;
  onFund: () => void;
  onComplete: () => void;
  onConfirm: () => void;
};

export default function ActionPanel(props: Props) {
  return (
    <div className="card">
      <h3>Ride Controls</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="primary" disabled={props.disabled} onClick={props.onRequest}>Request Ride</button>
        <button className="secondary" disabled={props.disabled} onClick={props.onAccept}>Accept Ride</button>
        <button className="secondary" disabled={props.disabled} onClick={props.onFund}>Fund Ride</button>
        <button className="secondary" disabled={props.disabled} onClick={props.onComplete}>Complete Ride</button>
        <button className="secondary" disabled={props.disabled} onClick={props.onConfirm}>Confirm Arrival</button>
      </div>
    </div>
  );
}
