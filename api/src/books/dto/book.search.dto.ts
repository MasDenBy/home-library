import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BookSearchDto implements Readonly<BookSearchDto> {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  pattern: string;

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  offset: number;

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  count: number;
}
