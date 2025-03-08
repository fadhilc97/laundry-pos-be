interface ILaundryConfigDto {
  key: string;
  name: string;
  value: string;
}

export interface IPostCreateLaundryConfigDto extends ILaundryConfigDto {}
export interface IPutUpdateLaundryConfigDto extends ILaundryConfigDto {}
