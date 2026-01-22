type Props = {
  drivers: any[];
};

export default function DriversSection({ drivers }: Props) {
  return (
    <div className="card">
      <h3>Available Drivers</h3>
      {drivers.length === 0 && <p>No drivers</p>}
    </div>
  );
}
