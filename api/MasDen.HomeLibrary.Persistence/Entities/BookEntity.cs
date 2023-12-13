using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Persistence.Entities;
public class BookEntity
{
    public BookId Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Authors { get; set; }
    public LibraryId LibraryId { get; set; }
    public string? ImageName { get; set; }
    public ICollection<EditionEntity>? Editions { get; set; }
}
