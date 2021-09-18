import { ApiProperty } from "@nestjs/swagger";

export class FileDto implements Readonly<FileDto> {
    @ApiProperty({required: false, type: Number})
    id: number;

    @ApiProperty({required: false, type: String})
    path: string;

    @ApiProperty({required: false, type: String})
    image: string;

    @ApiProperty({required: false, type: String})
    libraryId: number;
}

export class MetadataDto implements Readonly<MetadataDto> {
    @ApiProperty({required: false, type: Number})
    id: number;

    @ApiProperty({required: false, type: String})
    isbn: string;

    @ApiProperty({required: false, type: Number, nullable: true})
    pages: number | null;

    @ApiProperty({required: false, type: String})
    year: string;
}

export class BookDto implements Readonly<BookDto> {
    @ApiProperty({required: false, type: Number})
    id: number;

    @ApiProperty({required: true, type: String})
    title: string;

    @ApiProperty({required: false, type: String})
    description: string;

    @ApiProperty({required: false, type: String})
    authors: string;

    @ApiProperty({required: false, type: FileDto})
    file: FileDto;

    @ApiProperty({required: false, type: MetadataDto})
    metadata: MetadataDto;
}