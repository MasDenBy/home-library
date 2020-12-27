from flask_restx import Namespace, fields
from ..fields import Base64String


class BookDto:
    api = Namespace('books')
    file = api.model('file', {
        'id': fields.String(),
        'file_name': fields.String(),
        'path': fields.String(),
        'full_path': fields.String(),
        'image': Base64String(),
        'library_id': fields.Integer
    })
    book = api.model('book', {
        'id': fields.Integer(),
        'title': fields.String(),
        'external_id': fields.String,
        'description': fields.String(),
        'authors': fields.String(),
        'file': fields.Nested(file)
    })
    page = api.model('page', {
        'count': fields.Integer,
        'data': fields.List(fields.Nested(book))
    })