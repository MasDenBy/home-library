using Dapper;
using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Configuration;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;

internal class LibraryDataHelper : DataHelperBase
{
    public LibraryDataHelper(ApplicationConfiguration configuration)
        : base(configuration)
    {
    }

    protected override string TableName => "library";

    public async Task<IReadOnlyCollection<Library>> InsertAsync(IEnumerable<Library> libraries)
    {
        List<Library> result = new();

        foreach (var library in libraries)
        {
            result.Add(await InsertAsync(library.Path));
        }

        return result;
    }

    public async Task<Library> InsertAsync(string path)
    {
        using var connection = this.CreateConnection();

         var id = await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await
                connection.QuerySingleAsync<LibraryId>(
                    sql: "INSERT INTO library (path) VALUES (@path); SELECT CAST(LAST_INSERT_ID() AS INT);",
                    param: new
                    {
                        path
                    }));

        return new Library(id, path);
    }

    public async Task<bool> ExistsAsync(LibraryId id)
    {
        using var connection = this.CreateConnection();

        var count = await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await
                connection.QuerySingleAsync<int>(
                    sql: "SELECT COUNT(1) FROM library WHERE id = @id",
                    param: new { id }));

        return count > 0;
    }
}
