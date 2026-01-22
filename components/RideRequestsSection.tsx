export default function RideRequestsSection({
  rides,
  selectedRide,
  onSelect,
}: {
  rides: any[];
  selectedRide: number | null;
  onSelect: (i: number) => void;
}) {
  return (
    <div style={{ padding: 8 }}>
      <h3>Active Ride Requests</h3>
      {rides.length === 0 && <div>No rides</div>}
      {rides.map((ride) => (
        <div
          key={ride.index}
          onClick={() => onSelect(ride.index)}
          style={{
            cursor: "pointer",
            padding: 12,
            marginBottom: 8,
            borderRadius: 6,
            background: selectedRide === ride.index ? "rgba(64,128,255,0.12)" : "rgba(0,0,0,0.12)",
            border: selectedRide === ride.index ? "1px solid rgba(64,128,255,0.2)" : undefined,
          }}
        >
          <div style={{ fontWeight: 600 }}>
            Ride #{ride.index} — {ride.statusLabel}
          </div>
          <div style={{ fontSize: 12, color: "#9aa" }}>
            {ride.pickup ?? "—"} → {ride.destination ?? "—"}
          </div>
          <div style={{ fontSize: 12, color: "#8b8bff", marginTop: 6 }}>
            {ride.fareEth} ETH
          </div>
        </div>
      ))}
    </div>
  );
}
