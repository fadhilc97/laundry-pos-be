interface ISequenceDto {
  name: string;
  minDigits?: number;
  currentSequence?: number;
  laundryId?: number;
}

export interface IPostCreateSequenceDto extends ISequenceDto {}
export interface IPutUpdateSequenceDto extends ISequenceDto {}
