namespace MasDen.HomeLibrary.Domain.Entities;

public class Book
{
    public Book(string title, string? description, string? authors, FileId fileId, LibraryId libraryId)
        : this(BookId.Empty, title, description, authors, fileId, null, libraryId)
    {
    }

    public Book(BookId id, string title, string? description, string? authors, FileId fileId, MetadataId? metadataId, LibraryId libraryId)
    {
        Id = id;
        Title = title;
        Description = description;
        Authors = authors;
        FileId = fileId;
        MetadataId = metadataId;
        LibraryId = libraryId;
    }

    public BookId Id { get; private set; }
    public string Title { get; private set; } = null!;
    public string? Description { get; private set; }
    public string? Authors { get; private set; }
    public FileId FileId { get; private set; }
    public MetadataId? MetadataId { get; private set; }
    public LibraryId LibraryId { get; private set; }

    public void SetId(BookId bookId) => this.Id = bookId;
}
