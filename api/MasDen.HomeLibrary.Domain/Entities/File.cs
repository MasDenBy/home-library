namespace MasDen.HomeLibrary.Domain.Entities;

public record File
{
    public File(string path)
        : this(path, null)
    { }

    public File(string path, string? imageName)
    {
        this.Path = path;
        this.ImageName = imageName;
    }

    public FileId Id { get; init; }
    public string Path { get; init; } = null!;
    public string? ImageName { get; init; }
}
