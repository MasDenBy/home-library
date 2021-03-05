export interface BookDto {
    id: number;
    title: string;
    description: string;
    authors: string;
    file: FileDto;
    metadata: MetadataDto;
}

export interface FileDto {
    id: number;
    path: string;
    image: string;
    libraryId: number;
}

export interface MetadataDto {
    id: number;
    isbn: string;
    pages: number;
    year: string;
}