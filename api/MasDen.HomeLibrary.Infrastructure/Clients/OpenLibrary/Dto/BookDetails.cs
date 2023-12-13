using System.Text.Json.Serialization;

namespace MasDen.HomeLibrary.Infrastructure.Clients.OpenLibrary.Dto;
public record BookDetails
{
    public int NumberOfPages { get; init; }

    public string Title { get; init; } = null!;
    public string? Description { get; init; }
    public BookAuthor[] Authors { get; init; } = null!;

    [JsonPropertyName("publish_date")]
    public string? PublishDate { get; init; }
}
