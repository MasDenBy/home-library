using Dapper;
using MasDen.HomeLibrary.Persistence;
using MySqlConnector;
using Polly.Retry;
using System.Data;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;

internal abstract class DataHelperBase : IDisposable
{
    private readonly TestsConfiguration configuration;
    private readonly RetryOptions retryOptions;
    private bool disposed;

    protected DataHelperBase(TestsConfiguration configuration)
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
            .Execute(() => connection.Execute(sql: $"DELETE FROM {this.TableName}"));
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
