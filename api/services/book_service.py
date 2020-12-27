import os
import logging
import requests
import base64
from urllib.parse import urlparse

# from .goodreads import SearchBooks, Book
from .external_book_service import SearchBooks, Book
from database.repositories import BookRepository


class BookService:
    def __init__(self):
        self._book_repository = BookRepository()
        self._logger = logging.getLogger()


    def add(self, path: str, library_id: int):
        try:
            self._logger.info("Add book {path}".format(path=path))
            dir, file_name, title, ext = self._split_path(path)
            ext_book = self._search_book(title)
            params = self._create_book_params(
                ext_book,
                file_name=file_name,
                full_path=path,
                path=dir,
                library_id=library_id,
                title=title)
            self._book_repository.create(**params)
        except Exception as ex:
            self._logger.exception(ex)


    def delete(self, path: str):
        try:
            self._logger.info("Delete book {path}".format(path=path))
            self._book_repository.delete(path)
        except Exception as ex:
            self._logger.exception(ex)


    def delete_by_id(self, id: int):
        book = self._book_repository.get_by_id(id)
        if(book is None): return False
        try:
            os.remove(book.file.full_path)
            self._book_repository.delete(book.file.full_path)
        except Exception as ex:
            self._logger.exception(ex)
            return False

        return True


    def moved(self, from_path: str, to_path: str):
        try:
            self._logger.info("Move book from {from_path} to {to_path}".format(from_path=from_path, to_path=to_path))
            dir, file_name, title, ext = self._split_path(to_path)
            book = self._book_repository.get_by_path(from_path)
            external_id = book.external_id
            if external_id is None:
                ext_book = self._search_book(title)
            else:
                title = None
            params = self._create_book_params(
                ext_book,
                file_name=file_name,
                full_path=to_path,
                path=dir,
                library_id=book.file.library_id,
                title=title)
            self._book_repository.update(book.id, **params)
        except Exception as ex:
            self._logger.exception(ex)

    
    def update(self, id: int, book):
        params = self._create_book_params(
            None,
            file_name=book.file.file_name,
            full_path=book.file.full_path,
            path=book.file.path,
            library_id=book.file.library_id,
            title=book.title,
            description=book.description,
            authors=book.authors,
            external_id=book.external_id)
        self._book_repository.update(book.id, **params)


    def index(self, id: int):
        self._logger.info("Index book {id}".format(id=id))
        book = self._book_repository.get_by_id(id)

        if book.external_id is not None:
            ext_book = Book(book.external_id)
            params = self._create_book_params(ext_book)
            self._book_repository.update(book.id, **params)


    def _split_path(self, path:str):
        dir, file_name = os.path.split(path)
        title, ext = os.path.splitext(file_name)
        return dir, file_name, title, ext


    def _search_book(self, title: str):
        gr_books = SearchBooks(title).books()
        return gr_books[0] if len(gr_books) > 0 else None


    def _create_book_params(self, external_book, **kwargs):
        """
        :param str file_name: The name of the book file
        :param str full_path: The full path to the book file
        :param str path: The path to the folder with book file
        :param int library_id: The identifier of the library for the book
        :param str title: The title of the book
        :param str description: The book description
        :param str authors: The authors of the book
        :param int external_id: The identifier from external service
        """

        if external_book:
            kwargs["title"] = external_book.title()
            kwargs["external_id"] = external_book.id
            kwargs["description"] = external_book.description()
            kwargs["authors"] = ', '.join(map(lambda x: x.name(), external_book.authors()))
            kwargs["image"] = self._download_image(external_book.image_url())

        return kwargs


    def _download_image(self, url: str):
        img_data = requests.get(url).content
        return base64.b64encode(img_data)
