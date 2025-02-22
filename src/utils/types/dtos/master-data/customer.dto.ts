interface ICustomerDto {
  name: string;
  address: string;
}

interface ICustomerContactDto {
  whatsappPhone: string;
}

export interface IPostCreateCustomerDto
  extends ICustomerDto,
    ICustomerContactDto {}

export interface IPutUpdateCustomerDto extends ICustomerDto {}
