export interface CityPrice {
  price: number;
  change: number;
}

export interface GoldPrice {
  price_24k: number;
  price_22k: number;
  change_24k: number;
  change_22k: number;
}

export interface SinglePrice {
  price: number;
  change: number;
}

export interface DayPrices {
  petrol: Record<string, CityPrice>;
  diesel: Record<string, CityPrice>;
  gold: GoldPrice;
  lpg: SinglePrice;
  onion: SinglePrice;
  rice: SinglePrice;
  milk: SinglePrice;
  updatedAt: string;
}

export interface DisplayPrice {
  emoji: string;
  name: string;
  price: number;
  change: number;
  unit: string;
  category: string;
}
