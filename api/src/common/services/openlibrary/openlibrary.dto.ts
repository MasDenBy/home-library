export interface SearchResponseDto {
    numFound: number;
    docs: BookDocument[];
}

export interface BookDocument {
    isbn: string[];
}

export interface BookInfo {
    thumbnail_url: string;
    details: BookDetails;
}

export interface BookDetails {
    number_of_pages: number;
    title: string;
    description: Description;
    authors: Author[];
    publish_date:string;
}

export interface Author {
    key:string;
    name: string;
}

export interface Description {
    value:string;
}