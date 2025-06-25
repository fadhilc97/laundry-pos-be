export interface IReceiptTemplateData {
  laundry: {
    name: string;
    address: string;
    contactsDisplay: string;
  };
  transactionInfo: {
    reference: string;
    date: string;
    serviceType: string;
    customerName: string;
    customerContact: string;
  };
  items: {
    description: string;
    qty: string;
    qtyUnit: string;
    price: string;
    subTotal: string;
  }[];
  summary: {
    total: string;
    paid: string;
    pending: string;
  };
}
