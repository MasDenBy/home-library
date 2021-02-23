export interface BookDto {
    id: number;
    title: string;
    description: string;
    authors: string;
    file: FileDto;
}

export interface FileDto {
    id: number;
    path: string;
    image: string;
    libraryId: number;
}