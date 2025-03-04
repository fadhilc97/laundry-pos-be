interface ISequenceDto {
  name: string;
  minDigits?: number;
  currentSequence?: number;
}

export interface IPostCreateSequenceDto extends ISequenceDto {}
export interface IPutUpdateSequenceDto extends ISequenceDto {}
