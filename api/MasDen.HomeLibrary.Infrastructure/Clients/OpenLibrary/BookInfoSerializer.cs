using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Infrastructure.Clients.OpenLibrary.Dto;

namespace MasDen.HomeLibrary.Infrastructure.Clients.OpenLibrary;
internal class BookInfoSerializer
{
    public BookInfo Deserialize(string json, Isbn isbn)
    {
        if (string.IsNullOrWhiteSpace(json))
            throw new ArgumentNullException(nameof(json));

        using var jsonDocument = JsonDocument.Parse(json);

        if(!jsonDocument.RootElement.TryGetProperty($"isbn:{isbn}", out var root))
        {
            throw new InvalidOperationException($"The root element for {isbn} does not found.");
        }

        var thumbnailUrl = GetString(root, "thumbnail_url");

        var details = root.GetProperty("details");

        var authors = GetBookAuthors(details.GetProperty("authors"));
        var numberOfPages = GetInt(details, "number_of_pages");
        var title = GetString(details, "Title");

        return new BookInfo();
    }

    private static string? GetString(JsonElement element, string propertyName) => element.TryGetProperty(propertyName, out var property) ? property.GetString() : null;
    private static int? GetInt(JsonElement element, string propertyName) => element.TryGetProperty(propertyName, out var property) ? property.GetInt32() : null;

    private static BookAuthor[]? GetBookAuthors(JsonElement element)
    {
        var result = new List<BookAuthor>();

        foreach (var authorElement in element.EnumerateArray())
        {
            var name = GetString(authorElement, "name");

            if(name != null)
            {
                result.Add(new BookAuthor()
                {
                    Name = name
                });
            }
        }

        return result.ToArray();
    }
}
