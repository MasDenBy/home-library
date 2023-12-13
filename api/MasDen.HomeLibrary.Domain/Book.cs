namespace MasDen.HomeLibrary.Domain;

public class Book
{
	public Book(BookId id, string title, string? description, string? authors, Edition[]? editions, LibraryId libraryId, string? imageName)
	{
		Id = id;
		Title = title;
		Description = description;
		Authors = authors;
		Editions = editions;
		LibraryId = libraryId;
		ImageName = imageName;
	}

	public BookId Id { get; private set; }
    public string Title { get; private set; } = null!;
    public string? Description { get; private set; }
    public string? Authors { get; private set; }
    public ICollection<Edition>? Editions { get; private set; }
    public LibraryId LibraryId { get; private set; }
	public string? ImageName { get; set; }

	public void SetId(BookId bookId) => Id = bookId;
    public void AddEdition(Edition edition)
	{
		this.Editions ??= new List<Edition>();

        this.Editions.Append(edition);
    }

    public void Update(string title, string? description, string? authors)
    {
        Title = title;
        Description = description;
        Authors = authors;
    }
}
