type Props = {
  rides: any[];
  selectedRide: number | null;
  onSelectRide: (id: number) => void;
};

export default function RideRequestsSection({ rides, selectedRide, onSelectRide }: Props) {
  return (
    <div className="card">
      <h3>Active Ride Requests</h3>

      {rides.map((r, i) => (
        <div
          key={i}
          onClick={() => onSelectRide(i)}
          style={{
            padding: 10,
            marginTop: 8,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            background: selectedRide === i ? "#064e3b" : "transparent",
            cursor: "pointer"
          }}
        >
          Ride #{i} — Status: {r.status}
        </div>
      ))}

      {rides.length === 0 && <p>No rides</p>}
    </div>
  );
}
