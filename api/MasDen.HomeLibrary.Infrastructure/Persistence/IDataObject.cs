namespace MasDen.HomeLibrary.Infrastructure.Persistence;

public interface IDataObject<T> where T : class
{
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<int> ExecuteAsync(string sql, dynamic param, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TId> InsertAsync<TId>(string insertSql, dynamic param);
    Task<IEnumerable<TReturn>> QueryAsync<TFirst, TSecond, TThird, TReturn>(string sql, Func<TFirst, TSecond, TThird, TReturn> map, dynamic param, string splitOn = "Id", CancellationToken cancellationToken = default);
    Task<(IReadOnlyCollection<T> entities, long total)> QueryPageAsync(string sql, dynamic param, CancellationToken cancellationToken = default);
    Task<T> QuerySingleAsync(string where, dynamic param, CancellationToken cancellationToken = default);
}
