export interface ICountry {
  capital: string;
  currencies: { code: string; name: string; symbol: string }[];
  flag: string;
  name: string;
  population: number;
}

export interface IRegion {
  name: string;
}
