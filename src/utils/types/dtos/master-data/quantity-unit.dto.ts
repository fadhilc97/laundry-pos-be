interface IQuantityUnitDto {
  name: string;
  shortName: string;
}

export interface IPostCreateQuantityUnitDto extends IQuantityUnitDto {}
export interface IPutUpdateQuantityUnitDto extends IQuantityUnitDto {}
