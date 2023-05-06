using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Books.Queries.GetBooks;

public class BookDto
{
    public BookId Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Authors { get; set; }
}
