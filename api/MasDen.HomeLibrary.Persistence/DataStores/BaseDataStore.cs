using MasDen.HomeLibrary.Infrastructure.Persistence;

namespace MasDen.HomeLibrary.Persistence.DataStores;

public abstract class BaseDataStore<T> : IDataStore<T> where T : class
{
    private readonly IDataObjectFactory dataObjectFactory;

    private IDataObject<T>? dataObject;

    protected BaseDataStore(IDataObjectFactory dataObjectFactory)
    {
        this.dataObjectFactory = dataObjectFactory;
    }

    public IDataObject<T> DataObject
    {
        get
        {
            this.dataObject ??= this.dataObjectFactory.Create<T>();

            return this.dataObject;
        }
    }
}
