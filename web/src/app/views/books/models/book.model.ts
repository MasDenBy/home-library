export interface IBook {
    id: number;
    title: string;
    goodreads_id: number;
    description: string;
    authors: string;
    file: IFile;
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