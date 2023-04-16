using MasDen.HomeLibrary.Infrastructure.Configuration;
using MasDen.HomeLibrary.Infrastructure.Persistence;

namespace MasDen.HomeLibrary.Persistence;

internal class DataObjectFactory : IDataObjectFactory
{
    private readonly ApplicationConfiguration configuration;

    public DataObjectFactory(ApplicationConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public IDataObject<T> Create<T>() where T : class
        => new DataObject<T>(this.configuration.DatabaseConnectionString);
}
