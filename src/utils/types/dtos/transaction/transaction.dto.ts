import { ServiceType, TransactionStatus } from "@/schemas";

interface ITransactionDto {
  customerId: number;
  serviceType: ServiceType;
  items: ITransactionItemDto[];
}

interface ITransactionItemDto {
  productId: number;
  description: string;
  qtyUnitId: number;
  currencyId: number;
  qty: number;
  price: number;
}

export interface IPostCreateTransactionDto extends ITransactionDto {}
export interface IPuUpdateTransactionDto extends ITransactionDto {}
export interface IPostCreateTransactionItemDto extends ITransactionItemDto {}
export interface IPutUpdateTransactionItemDto extends ITransactionItemDto {}

export interface IPutUpdateTransactionStatusDto {
  status: TransactionStatus;
}
export interface IPutUpdateTransactionLocationDto {
  locationId: number;
}
