using MasDen.HomeLibrary.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace MasDen.HomeLibrary.Books.Queries.GetBook;

[Mapper]
public partial class BookMapper
{
    public partial BookDto ToDto(Book book);
}