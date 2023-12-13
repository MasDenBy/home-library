using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Infrastructure.Clients.OpenLibrary.Dto;

namespace MasDen.HomeLibrary.Infrastructure.Clients.OpenLibrary;
public interface IOpenLibraryHttpClient
{
    Task<BookInfo?> FindByIsbnAsync(Isbn isbn);
    Task<Isbn?> FindIsbnAsync(string pattern);
}