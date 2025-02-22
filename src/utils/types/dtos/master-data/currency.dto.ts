interface ICurrencyDto {
  name: string;
  shortName: string;
  symbol: string;
  countryName: string;
}

export interface IPostCreateCurrencyDto extends ICurrencyDto {}
export interface IPutUpdateCurrencyDto extends ICurrencyDto {}
