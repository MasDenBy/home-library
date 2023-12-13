using System.Net.Http.Json;
using System.Web;
using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Infrastructure.Clients.OpenLibrary.Dto;

namespace MasDen.HomeLibrary.Infrastructure.Clients.OpenLibrary;

public class OpenLibraryHttpClient : IOpenLibraryHttpClient
{
    private readonly HttpClient httpClient;

    public OpenLibraryHttpClient(HttpClient httpClient)
    {
        this.httpClient = httpClient;
    }

    public async Task<BookInfo?> FindByIsbnAsync(Isbn isbn)
    {
        ArgumentNullException.ThrowIfNull(isbn);

        var url = $"/api/books?bibkeys=isbn:{isbn}&jscmd=details&format=json";

        var response = await this.httpClient.GetAsync(url);

        var json = await response.Content.ReadAsStringAsync();

        return new BookInfoSerializer().Deserialize(json, isbn);
    }

    public async Task<Isbn?> FindIsbnAsync(string pattern)
    {
        ArgumentNullException.ThrowIfNull(pattern);

        var url = $"/search.json?q={HttpUtility.UrlEncode(pattern)}";

        var response = await this.httpClient.GetAsync(url);
        var searchResponse = await response.Content.ReadFromJsonAsync<SearchResponse>();

        if(searchResponse?.Found > 0 && searchResponse?.Books?[0]?.Isbn?.Length > 0)
        {
            return searchResponse?.Books?[0]?.Isbn?[0];
        }

        return null;
    }
}
