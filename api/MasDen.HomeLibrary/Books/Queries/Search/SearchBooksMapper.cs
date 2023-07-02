using MasDen.HomeLibrary.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace MasDen.HomeLibrary.Books.Queries.Search;

[Mapper]
public partial class SearchBooksMapper
{
    public partial IReadOnlyCollection<SearchBookPageItemDto> ToDto(IEnumerable<Book> books);
}
