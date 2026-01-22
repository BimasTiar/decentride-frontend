export type Driver = {
  id: number;
  wallet: string;
  pricePerKm: string;
  available: boolean;
};

export type Ride = {
  id: number;
  rider: string;
  driver: string;
  from: string;
  to: string;
  price: string;
  status: number;
};