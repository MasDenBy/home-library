import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { toNumber } from '../../core/common/helpers/cast.helper';

export class ListQueryDto {
  @Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
  @IsNumber()
  public offset: number;

  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  public count: number;
}
