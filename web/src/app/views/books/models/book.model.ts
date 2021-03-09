export interface IBook {
    id: number;
    title: string;
    description: string;
    authors: string;
    file: IFile;
    metadata: IMetadata;
}

export interface IFile {
    id: number;
    path: string;
    image: string;
    libraryId: number;
}

export interface IPage {
    count: number;
    data: IBook[];
}

export interface BookSearchDto {
    pattern: string;
    offset: number;
    count: number;
}
export interface IMetadata {
    id: number;
    isbn: string;
    pages: number | null;
    year: string;
}
