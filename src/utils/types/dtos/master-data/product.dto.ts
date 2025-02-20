import { ServiceType } from "@/schemas";

export interface IProductDto {
  name: string;
  price: number;
  qtyUnitId: number;
  currencyId: number;
  serviceType: ServiceType;
}

export interface IPostCreateProductDto extends IProductDto {}
export interface IPutUpdateProductDto extends IProductDto {}
