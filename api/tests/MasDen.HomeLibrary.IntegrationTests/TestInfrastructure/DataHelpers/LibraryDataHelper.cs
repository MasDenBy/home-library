using Dapper;
using MasDen.HomeLibrary.Domain.Entities;
using MySqlConnector;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;

internal class LibraryDataHelper : IDisposable
{
    private readonly string connectionString;
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

        return library;
    }

    private void CleanTable()
    {
        using var connection = new MySqlConnection(this.connectionString);
        connection.Open();

        connection.Execute(sql: "DELETE FROM library");
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (this.disposed) return;

        if (disposing)
        {
            this.CleanTable();
        }

        this.disposed = true;
    }
}
