using MasDen.HomeLibrary.Infrastructure.Configuration;
using MasDen.HomeLibrary.Infrastructure.Persistence;

namespace MasDen.HomeLibrary.Persistence;

internal class DataObjectFactory : IDataObjectFactory
{
    private readonly ApplicationConfiguration configuration;
    private readonly IDbConnectionWrapper connectionWrapper;

    public DataObjectFactory(ApplicationConfiguration configuration, IDbConnectionWrapper connectionWrapper)
    {
        this.configuration = configuration;
        this.connectionWrapper = connectionWrapper;
    }

    public IDataObject<T> Create<T>() where T : class
        => new DataObject<T>(
            connectionWrapper: this.connectionWrapper,
            retryOptions: new RetryOptions(this.configuration.DatabaseRetryCount, this.configuration.DatabaseRetryDelay, this.configuration.DatabaseRetryMaxDelay));
}
