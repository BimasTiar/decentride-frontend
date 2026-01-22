export default function DriversSection({ drivers }: { drivers: any[] }) {
  return (
    <div className="card">
      <h3>Available Drivers</h3>
      {drivers.length === 0 && <p>No drivers</p>}
      {drivers.map((d, i) => (
        <div key={i}>
          {d.name} — {d.rate}
        </div>
      ))}
    </div>
  );
}
