export default function ActionPanel(props: any) {
  return (
    <div className="card">
      <button onClick={props.onRequest}>Request</button>
      <button onClick={props.onAccept}>Accept</button>
      <button onClick={props.onFund}>Fund</button>
      <button onClick={props.onComplete}>Complete</button>
      <button onClick={props.onConfirm}>Confirm</button>
    </div>
  );
}
