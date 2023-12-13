using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MediatR;

namespace MasDen.HomeLibrary.Books.Queries.DownloadBook;
public record DownloadBookQuery(BookId BookId, EditionId EditionId) : IRequest<(Stream, string)>;