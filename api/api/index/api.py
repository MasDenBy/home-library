from flask_restx import Namespace, Resource
from flask import jsonify

from services.indexer import Indexer
from api.helpers import ok, not_found


api_ns = Namespace('index')


@api_ns.route("/")
class Index(Resource):
    @api_ns.response(200, "Index finished.")
    def get(self):
        Indexer().start_all()
        return ok(True)


@api_ns.route("/<int:id>")
@api_ns.response(404, "Library not found")
@api_ns.param("id", "The library id")
class IndexLibrary(Resource):
    @api_ns.doc("Index library")
    @api_ns.response(200, "Library was indexed")
    def get(self, id):
        try:
            Indexer().start(id)
            return ok()
        except:
            return not_found()


@api_ns.route("/book/<int:id>")
@api_ns.response(404, "Book not found")
@api_ns.param("id", "The book id")
class IndexBook(Resource):
    @api_ns.doc("Index book")
    @api_ns.response(200, "Book was indexed")
    def get(self, id):
        try:
            Indexer().index_book(id)
            return ok()
        except:
            return not_found() 