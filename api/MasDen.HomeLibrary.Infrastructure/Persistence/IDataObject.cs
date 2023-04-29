namespace MasDen.HomeLibrary.Infrastructure.Persistence;

public interface IDataObject<T> where T : class
{
    Task<bool> DeleteAsync(T entity);
    Task<IReadOnlyCollection<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<int> InsertAsync(T entity);
    Task<T> QuerySingleAsync(string where, dynamic param, CancellationToken cancellationToken = default);
}
