from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from .db import db


class Library(db.Model):
    __tablename__ = "libraries"
    id = Column(Integer, primary_key=True)
    path = Column(String)
    files = relationship("File", cascade="all, delete, delete-orphan")


class File(db.Model):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True)
    file_name = Column(String)
    path = Column(String)
    full_path = Column(String)
    image = Column(String)
    library_id = Column(Integer, ForeignKey("libraries.id"))
    book_id = Column(Integer, ForeignKey('books.id'))
    book = relationship("Book", single_parent=True, cascade="delete")


class Setting(db.Model):
    __tablename__ = "settings"
    key = Column(String, primary_key=True)
    value = Column(String)


class Book(db.Model):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    external_id = Column(String)
    description = Column(String)
    authors = Column(String)
    file = relationship("File", uselist=False)