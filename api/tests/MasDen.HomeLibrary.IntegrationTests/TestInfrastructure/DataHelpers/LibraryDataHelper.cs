using Dapper;
using MasDen.HomeLibrary.Domain.Entities;
using MySqlConnector;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;

internal class LibraryDataHelper : IDisposable
{
    private readonly string connectionString;
    private readonly List<int> addedIds = new();
    private bool disposed;

    public LibraryDataHelper(string connectionString)
    {
        this.connectionString = connectionString;
    }

    public async Task<IReadOnlyCollection<Library>> InsertAsync(IEnumerable<Library> libraries)
    {
        List<Library> result = new();

        foreach (var library in libraries)
        {
            result.Add(await InsertAsync(library));
        }

        return result;
    }

    public async Task<Library> InsertAsync(Library library)
    {
        using var connection = new MySqlConnection(this.connectionString);
        await connection.OpenAsync();

        library.Id = await connection.QuerySingleAsync<int>(
            sql: "INSERT INTO library (id, path) VALUES (@id, @path); SELECT LAST_INSERT_ID();",
            param: new
            {
                id = library.Id,
                path = library.Path
            });

        this.addedIds.Add(library.Id);

        return library;
    }

    public void Delete(IEnumerable<int> ids)
    {
        using var connection = new MySqlConnection(this.connectionString);
        connection.Open();

        connection.Execute(
            sql: "DELETE FROM library WHERE id IN @ids",
            param: new
            {
                ids
            });
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (this.disposed) return;

        if (disposing && this.addedIds.Count > 0)
        {
            this.Delete(this.addedIds);
        }

        this.disposed = true;
    }
}
