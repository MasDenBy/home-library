namespace MasDen.HomeLibrary.Infrastructure.Persistence;

public interface IDataObject<T> where T : class
{
    Task<bool> DeleteAsync(T entity);
    Task<IReadOnlyCollection<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TId> InsertAsync<TId>(string insertSql, dynamic param);
    Task<(IReadOnlyCollection<T> entities, long total)> QueryPageAsync(string sql, dynamic param, CancellationToken cancellationToken = default);
    Task<T> QuerySingleAsync(string where, dynamic param, CancellationToken cancellationToken = default);
}
