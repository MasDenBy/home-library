using Dapper;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;

internal class FileDataHelper : DataHelperBase
{
    public FileDataHelper(TestsConfiguration configuration)
        : base(configuration)
    {
    }

    protected override string TableName => "file";

    public async Task<IReadOnlyCollection<Domain.Entities.File>> InsertAsync(IEnumerable<Domain.Entities.File> files)
    {
        List<Domain.Entities.File> result = new();

        foreach (var file in files)
        {
            result.Add(await InsertAsync(file));
        }

        return result;
    }

    public async Task<Domain.Entities.File> InsertAsync(Domain.Entities.File file)
    {
        using var connection = this.CreateConnection();

        var id = await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await
                connection.QuerySingleAsync<FileId>(
                    sql: "INSERT INTO file (id, path, imageName) VALUES (@id, @path, @imageName); SELECT CAST(LAST_INSERT_ID() AS INT);",
                    param: new
                    {
                        id = file.Id,
                        path = file.Path,
                        imageName = file.ImageName
                    }));

        return file with { Id = id };
    }
}
