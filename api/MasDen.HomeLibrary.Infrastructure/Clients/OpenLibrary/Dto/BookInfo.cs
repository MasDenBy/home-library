namespace MasDen.HomeLibrary.Infrastructure.Clients.OpenLibrary.Dto;

public record BookInfo
{
    public string? ThumbnaiUrl { get; init; }
    public BookDetails Details { get; init; } = null!;
}
