using System.Data;
using Dapper;
using MasDen.HomeLibrary.Infrastructure.Configuration;
using MasDen.HomeLibrary.Persistence;
using MySqlConnector;
using Polly.Retry;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;

internal abstract class DataHelperBase : IDisposable
{
    private readonly ApplicationConfiguration configuration;
    private readonly RetryOptions retryOptions;
    private bool disposed;

    protected DataHelperBase(ApplicationConfiguration configuration)
    {
        this.configuration = configuration;
        this.retryOptions = new RetryOptions(configuration.DatabaseRetryCount, configuration.DatabaseRetryDelay, configuration.DatabaseRetryMaxDelay);
    }

    protected abstract string TableName { get; }
    protected AsyncRetryPolicy AsyncRetryPolicy => Policies.CreateAsyncRetryPolicy(this.retryOptions);

    protected IDbConnection CreateConnection() => new MySqlConnection(this.configuration.DatabaseConnectionString);

    private void CleanTable()
    {
        using var connection = new MySqlConnection(this.configuration.DatabaseConnectionString);

        Policies.CreateRetryPolicy(this.retryOptions)
            .Execute(() => connection.Execute(sql: $"SET FOREIGN_KEY_CHECKS=0;DELETE FROM {this.TableName};SET FOREIGN_KEY_CHECKS=1;"));
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (this.disposed) return;

        if (disposing)
        {
            this.CleanTable();
        }

        this.disposed = true;
    }
}
