namespace MasDen.HomeLibrary.Infrastructure.Persistence;

public interface IDataObject<T> where T : class
{
    Task<IReadOnlyCollection<T>> GetAllAsync(CancellationToken cancellationToken = default);
}
