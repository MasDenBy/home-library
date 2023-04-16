namespace MasDen.HomeLibrary.Domain.Entities;

public class Library
{
    public Library(int id, string path)
    {
        Id = id;
        Path = path;
    }

    public int Id { get; set; }
    public string Path { get; set; }
}
