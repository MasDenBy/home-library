using Dapper;
using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Persistence;
using MySqlConnector;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;

internal class LibraryDataHelper : IDisposable
{
    private readonly TestsConfiguration configuration;
    private readonly RetryOptions retryOptions;
    private bool disposed;

    public LibraryDataHelper(TestsConfiguration configuration)
    {
        this.configuration = configuration;
        this.retryOptions = new RetryOptions(configuration.DatabaseRetryCount, configuration.DatabaseRetryDelay, configuration.DatabaseRetryMaxDelay);
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
        using var connection = new MySqlConnection(this.configuration.DatabaseConnectionString);

        library.Id = await Policies.CreateAsyncRetryPolicy(this.retryOptions)
            .ExecuteAsync(async () => await
                connection.QuerySingleAsync<int>(
                    sql: "INSERT INTO library (id, path) VALUES (@id, @path); SELECT LAST_INSERT_ID();",
                    param: new
                    {
                        id = library.Id,
                        path = library.Path
                    }));

        return library;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        using var connection = new MySqlConnection(this.configuration.DatabaseConnectionString);

        var count = await Policies.CreateAsyncRetryPolicy(this.retryOptions)
            .ExecuteAsync(async () => await
                connection.QuerySingleAsync<int>(
                    sql: "SELECT COUNT(1) FROM library WHERE id = @id",
                    param: new { id }));

        return count > 0;
    }

    private void CleanTable()
    {
        using var connection = new MySqlConnection(this.configuration.DatabaseConnectionString);

        Policies.CreateRetryPolicy(this.retryOptions)
            .Execute(() => connection.Execute(sql: "DELETE FROM library"));
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
