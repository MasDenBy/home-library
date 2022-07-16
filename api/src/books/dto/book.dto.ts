import { ApiProperty } from '@nestjs/swagger';
import { isNumber, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class FileDto implements Readonly<FileDto> {
  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  path: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  libraryId: number;
}

export class MetadataDto implements Readonly<MetadataDto> {
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  isbn: string;

  @ApiProperty({ required: false, type: Number, nullable: true })
  @IsOptional()
  @IsNumber()
  pages: number | null;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  year: string;
}

export class BookDto implements Readonly<BookDto> {
  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({ required: true, type: String })
  @IsString()
  title: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  authors: string;

  @ApiProperty({ required: false, type: FileDto })
  @ValidateNested()
  file: FileDto;

  @ApiProperty({ required: false, type: MetadataDto })
  @ValidateNested()
  metadata: MetadataDto;
}
