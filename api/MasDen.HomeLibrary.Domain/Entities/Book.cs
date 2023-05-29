namespace MasDen.HomeLibrary.Domain.Entities;

public class Book
{
    public BookId Id { get; private set; }
    public string Title { get; private set; } = null!;
    public string? Description { get; private set; }
    public string? Authors { get; private set; }
    public File File { get; private set; } = null!;
    public Metadata? Metadata { get; private set; }
    public LibraryId LibraryId { get; private set; }

    public void SetId(BookId bookId) => this.Id = bookId;
    public void SetFile(File file) => this.File = file;
    public void SetMetadata(Metadata metadata) => this.Metadata = metadata;
    public void Update(string title, string? description, string? authors)
    {
        this.Title = title;
        this.Description = description;
        this.Authors = authors;
    }
}
