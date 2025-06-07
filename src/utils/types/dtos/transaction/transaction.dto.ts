import { ServiceType } from "@/schemas";

interface ITransactionDto {
  customerId: number;
  serviceType: ServiceType;
  items: ITransactionItemDto[];
}

interface ITransactionItemDto {
  productId: number;
  description: string;
  qtyUnitId: number;
  qty: number;
  price: number;
}

export interface IPostCreateTransactionDto extends ITransactionDto {}
export interface IPutUpdateTransactionDto extends ITransactionDto {}
export interface IPutUpdateTransactionFinishedDto {
  locationId?: number;
}
export interface IPostCreateTransactionItemDto extends ITransactionItemDto {}
export interface IPutUpdateTransactionItemDto extends ITransactionItemDto {}

export interface IPutUpdateTransactionLocationDto {
  locationId: number;
}

export interface IPostCreateTransactionPaymentDto {
  paymentMethod: string;
  amount: number;
}
