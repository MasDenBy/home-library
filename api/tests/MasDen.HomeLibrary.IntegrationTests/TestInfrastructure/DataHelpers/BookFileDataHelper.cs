using Dapper;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;

internal class BookFileDataHelper : DataHelperBase
{
    public BookFileDataHelper(TestsConfiguration configuration)
        : base(configuration)
    {
    }

    protected override string TableName => "bookfile";

    public async Task<IReadOnlyCollection<Domain.Entities.BookFile>> InsertAsync(IEnumerable<Domain.Entities.BookFile> files)
    {
        List<Domain.Entities.BookFile> result = new();

        foreach (var file in files)
        {
            result.Add(await InsertAsync(file));
        }

        return result;
    }

    public async Task<Domain.Entities.BookFile> InsertAsync(Domain.Entities.BookFile file)
    {
        using var connection = this.CreateConnection();

        var id = await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await
                connection.QuerySingleAsync<BookFileId>(
                    sql: "INSERT INTO bookfile (id, path, imageName, bookId) VALUES (@id, @path, @imageName, @bookId); SELECT CAST(LAST_INSERT_ID() AS INT);",
                    param: new
                    {
                        id = file.Id,
                        path = file.Path,
                        imageName = file.ImageName,
                        bookId = file.BookId
                    }));

        return file with { Id = id };
    }
}
