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
    file_name: string;
    path: string;
    full_path: string;
    image: string;
    library_id: number;
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