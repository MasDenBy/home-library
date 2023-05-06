namespace MasDen.HomeLibrary.Domain.Entities;

public class Library
{
    public Library(string path)
        :this(LibraryId.Empty, path)
    { }

    public Library(LibraryId id, string path)
    {
        Id = id;
        Path = path;
    }

    public LibraryId Id { get; private set; }
    public string Path { get; private set; }

    public void SetId(LibraryId libraryId) => this.Id = libraryId;
}
