namespace MasDen.HomeLibrary.Domain.Entities;

public class Library
{
    public Library() { }
    public Library(string path)
    {
        Path = path;
    }

    public LibraryId Id { get; private set; }
    public string Path { get; private set; } = null!;

    public void SetId(LibraryId libraryId) => this.Id = libraryId;
}
