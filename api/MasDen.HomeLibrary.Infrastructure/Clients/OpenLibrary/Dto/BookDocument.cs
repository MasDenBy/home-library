using MasDen.HomeLibrary.Domain;

namespace MasDen.HomeLibrary.Infrastructure.Clients.OpenLibrary.Dto;

public record BookDocument
{
    //public string[]? Isbn { get; init; }
    public Isbn[]? Isbn { get; set; }
}