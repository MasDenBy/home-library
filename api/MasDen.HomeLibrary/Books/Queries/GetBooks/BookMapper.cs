using MasDen.HomeLibrary.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace MasDen.HomeLibrary.Books.Queries.GetBooks;

[Mapper]
public partial class BookMapper
{
    public partial IReadOnlyCollection<BookDto> ToDto(IEnumerable<Book> books);
}
