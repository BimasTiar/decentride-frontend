export default function RideRequestsSection({
  rides,
  onSelect,
}: {
  rides: any[];
  onSelect: (i: number) => void;
}) {
  return (
    <div className="card">
      <h3>Active Ride Requests</h3>
      {rides.map((r, i) => (
        <div key={i} className="item" onClick={() => onSelect(i)}>
          Ride #{i} — Status: {r.status}
        </div>
      ))}
    </div>
  );
}
