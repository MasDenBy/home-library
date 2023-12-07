using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MediatR;

namespace MasDen.HomeLibrary.Books.Queries.DownloadBook;
public record DownloadBookQuery(BookId Id) : IRequest<(Stream, string)>;