using Dapper;
using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;
internal class MetadataDataHelper : DataHelperBase
{
    public MetadataDataHelper(TestsConfiguration configuration)
        : base(configuration)
    {
    }

    protected override string TableName => "metadata";

    public async Task<Metadata> InsertAsync(Metadata metadata)
    {
        using var connection = this.CreateConnection();

        var id = await this.AsyncRetryPolicy
           .ExecuteAsync(async () => await
               connection.QuerySingleAsync<MetadataId>(
                   sql: "INSERT INTO metadata (id, isbn, pages, year) VALUES (@id, @isbn, @pages, @year); SELECT CAST(LAST_INSERT_ID() AS INT);",
                   param: new
                   {
                       id = metadata.Id,
                       isbn = metadata.Isbn,
                       pages = metadata.Pages,
                       year = metadata.Year
                   }));

        return metadata with { Id = id };
    }
}
