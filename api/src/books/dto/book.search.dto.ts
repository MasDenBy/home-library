import { ApiProperty } from '@nestjs/swagger';

export class BookSearchDto implements Readonly<BookSearchDto> {
  @ApiProperty({ required: true, type: String })
  pattern: string;

  @ApiProperty({ required: true, type: Number })
  offset: number;

  @ApiProperty({ required: true, type: Number })
  count: number;
}
