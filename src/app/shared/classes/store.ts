export interface Store {
  id?: number;
  name: string;
  description: string;
  currency: string;
  logo_url: string;
  location: [];
  phone: string;
  shipment_options: ShipmentOptions[];
}

export interface ShipmentOptions {
  name: string;
  price: string;
}
