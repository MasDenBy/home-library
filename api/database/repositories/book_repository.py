from sqlalchemy import or_

from ..models import Book, File
from ..db import db


class BookRepository:
    def __init__(self):
        self._db = db

    def create(self, **params):
        file, book = self._parse_params(**params)
        self._db.session.add(book)
        self._db.session.commit()


    def delete(self, file_path: str):
        session = self._db.session
        try:
            file = session.query(File).filter_by(full_path=file_path).first()
            if file is None:
                raise Exception("The file does not found {file}".format(file=file_path))
            book = session.query(Book).filter_by(id=file.book_id).first()
            session.delete(book)
            session.delete(file)
            session.commit()
        except Exception as ex:
            print(ex)
            session.rollback()
        finally:
            session.close()


    def get_by_path(self, path: str):
        return self._db.session.query(Book).join(File, Book.file).filter_by(full_path=path).first()


    def get_by_id(self, id: int):
        return self._db.session.query(Book).join(File, Book.file).filter(Book.id==id).first()

    
    def update(self, id: int, **params):
        file_data, book_data = self._parse_params(**params)
        book = self.get_by_id(id)
        if book is None:
            raise Exception("The book with id {id} doesn't find.".format(id=id))
        if book_data.title is not None:
            book.title = book_data.title
        book.external_id = book_data.external_id
        book.description = book_data.description
        book.authors = book_data.authors

        if file_data.file_name is not None:
            book.file.file_name = file_data.file_name
            book.file.path = file_data.path
            book.file.full_path = file_data.full_path

        if file_data.image is not None:
            book.file.image = file_data.image

        self._db.session.commit()


    def get_list(self, offset:int, count:int):
        return {
            "data": Book.query.offset(offset).limit(count).all(),
            "count": Book.query.count()
        }


    def search(self, pattern: str, offset: int, count: int):
        query = Book.query.filter(
            or_(
                Book.title.contains(pattern),
                Book.description.contains(pattern),
                Book.authors.contains(pattern)
            )
        )

        return {
            "data": query.offset(offset).limit(count).all(),
            "count": query.count()
        }


    def _parse_params(self, **params):
        file = File(file_name = params.get("file_name", None),
                    full_path = params.get("full_path", None),
                    path = params.get("path", None),
                    library_id = params.get("library_id", None),
                    image = params.get("image", None))
        book = Book(title = params["title"],
                    external_id = params.get("external_id", None),
                    description = params.get("description", None),
                    authors = params.get("authors", None),
                    file = file)
        return file, book