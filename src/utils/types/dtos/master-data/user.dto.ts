export interface IUserDto {
  name: string;
  email: string;
  password: string;
  roleIds: number[];
  laundryId?: number;
}

export interface IPostCreateUserDto extends IUserDto {}
export interface IPutUpdateUserDto extends IUserDto {}
