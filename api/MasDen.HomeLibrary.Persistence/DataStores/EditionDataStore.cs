using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Persistence.Entities;
using MasDen.HomeLibrary.Persistence.Mappers;

namespace MasDen.HomeLibrary.Persistence.DataStores;
public class EditionDataStore : BaseDataStore<EditionEntity>, IEditionDataStore
{
    public EditionDataStore(IDataObjectFactory dataObjectFactory)
        : base(dataObjectFactory)
    {
    }

    public async Task<Edition> GetAsync(EditionId id, BookId bookId, CancellationToken cancellationToken = default)
    {
        var entity = await this.DataObject.QuerySingleAsync(
            "id=@id AND bookId=@bookId", new { id, bookId }, cancellationToken);

        return new EditionMapper().ToDomain(entity);
    }

    public Task<EditionId> CreateAsync(Edition edition) =>
        this.DataObject.InsertAsync<EditionId>(
            insertSql: "INSERT INTO edition (id, title, isbn, pages, year, filePath, bookId) VALUES (@id, @title, @isbn, @pages, @year, @filePath, @bookId)",
            param: new
            {
                id = edition.Id,
                title = edition.Title,
                isbn = edition.Isbn,
                pages = edition.Pages,
                year = edition.Year,
                filePath = edition.FilePath,
                bookId = edition.BookId
            });

    public async Task UpdateAsync(Edition edition, CancellationToken cancellationToken = default)
    {
        await this.DataObject.ExecuteAsync(
            sql: @"
                    UPDATE edition
                    SET isbn = @isbn,
                        title = @title,
                        pages = @pages,
                        year = @year
                    WHERE id = @id",
            new
            {
                id = edition.Id,
                isbn = edition.Isbn,
                title = edition.Title,
                pages = edition.Pages,
                year = edition.Year
            },
            cancellationToken: cancellationToken);
    }

    public async Task DeleteAsync(EditionId id, CancellationToken cancellationToken = default)
    {
        if(!await this.DataObject.DeleteAsync(id.Value, cancellationToken))
        {
            throw new NotFoundException(typeof(Edition), id.Value);
        }
    }
}
