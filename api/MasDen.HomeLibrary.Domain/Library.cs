namespace MasDen.HomeLibrary.Domain;

public class Library
{
    public Library(LibraryId id, string path)
    {
        Id = id;
        Path = path;
    }

    public LibraryId Id { get; private set; }
    public string Path { get; private set; } = null!;
}
