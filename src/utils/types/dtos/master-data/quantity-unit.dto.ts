interface IQuantityUnitDto {
  name: string;
  shortName: string;
  decimalPlaces?: number;
}

export interface IPostCreateQuantityUnitDto extends IQuantityUnitDto {}
export interface IPutUpdateQuantityUnitDto extends IQuantityUnitDto {}
