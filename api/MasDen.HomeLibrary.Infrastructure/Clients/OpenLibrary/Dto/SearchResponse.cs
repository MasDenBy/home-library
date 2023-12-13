using System.Text.Json.Serialization;

namespace MasDen.HomeLibrary.Infrastructure.Clients.OpenLibrary.Dto;
public record SearchResponse
{
    [JsonPropertyName("numFound")]
    public int Found { get; init; }

    [JsonPropertyName("docs")]
    public BookDocument[]? Books { get; init; }
}
