using MasDen.HomeLibrary.Infrastructure.Persistence;

namespace MasDen.HomeLibrary.Persistence;

public interface IDataObjectFactory
{
    IDataObject<T> Create<T>() where T : class;
}