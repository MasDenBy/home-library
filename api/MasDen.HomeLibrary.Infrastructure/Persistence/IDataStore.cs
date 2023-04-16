namespace MasDen.HomeLibrary.Infrastructure.Persistence;

public interface IDataStore<T> where T : class
{
    IDataObject<T> DataObject { get; }
}
