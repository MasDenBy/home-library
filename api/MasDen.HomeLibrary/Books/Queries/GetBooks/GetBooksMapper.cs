using MasDen.HomeLibrary.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace MasDen.HomeLibrary.Books.Queries.GetBooks;

[Mapper]
public partial class GetBooksMapper
{
    public partial IReadOnlyCollection<BookPageItemDto> ToDto(IEnumerable<Book> books);
}
