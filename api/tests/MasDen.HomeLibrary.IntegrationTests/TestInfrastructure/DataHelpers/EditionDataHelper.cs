using System.Data;
using Dapper;
using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Configuration;
using MasDen.HomeLibrary.Persistence.Entities;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;
internal class EditionDataHelper : DataHelperBase
{
    public EditionDataHelper(ApplicationConfiguration configuration)
        : base(configuration)
    {
    }

    protected override string TableName => "edition";

    public async Task<Edition> InsertAsync(Edition edition)
    {
        using var connection = this.CreateConnection();

        return await InsertImplAsync(connection, edition);
    }

	public async Task<IReadOnlyCollection<Edition>> InsertAsync(IEnumerable<Edition> editions)
	{
		using var connection = this.CreateConnection();

		var result = new List<Edition>();

		foreach (var edition in editions)
		{
			result.Add(await this.InsertImplAsync(connection, edition));
		}

		return result;
	}

	public async Task<EditionEntity> GetAsync(EditionId editionId)
	{
		using var connection = this.CreateConnection();

		CommandDefinition command = new(@"SELECT *
              FROM edition
              WHERE id = @id", new { id = editionId });

		return await this.AsyncRetryPolicy.ExecuteAsync(
			async () => await connection.QueryFirstAsync<EditionEntity>(command));
	}

	private async Task<Edition> InsertImplAsync(IDbConnection connection, Edition edition)
	{
		var id = await this.AsyncRetryPolicy
		   .ExecuteAsync(async () => await
			   connection.QuerySingleAsync<EditionId>(
				   sql: "INSERT INTO edition (id, title, isbn, pages, year, bookId, filePath) VALUES (@id, @title, @isbn, @pages, @year, @bookId, @filePath); SELECT CAST(LAST_INSERT_ID() AS INT);",
				   param: new
				   {
					   id = edition.Id,
					   title = edition.Title,
					   isbn = edition.Isbn,
					   pages = edition.Pages,
					   year = edition.Year,
					   bookId = edition.BookId,
					   filePath = edition.FilePath
				   }));

		return edition with { Id = id };
	}
}
