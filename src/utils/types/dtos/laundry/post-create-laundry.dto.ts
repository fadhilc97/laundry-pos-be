export interface IPostCreateLaundryDto {
  name: string;
  address: string;
  contacts: ILaundryContactDto;
}

export interface ILaundryContactDto {
  whatsapp: string;
  phone?: string;
  email?: string;
  instagram?: string;
  website?: string;
}
