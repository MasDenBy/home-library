using System.Data;
using System.Net.Sockets;
using Dapper;
using Dapper.Contrib.Extensions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MySqlConnector;
using Polly.Contrib.WaitAndRetry;
using Polly;
using Polly.Retry;

namespace MasDen.HomeLibrary.Persistence;

internal class DataObject<T> : IDataObject<T>
    where T : class
{
    private readonly string connectionString;
    private readonly RetryOptions retryOptions;

    private readonly TimeSpan maxDelay;
    private readonly TimeSpan delay;

    public DataObject(string connectionString, RetryOptions retryOptions)
    {
        this.connectionString = connectionString;
        this.retryOptions = retryOptions;

        this.maxDelay = TimeSpan.FromSeconds(retryOptions.MaxDelay);
        this.delay = TimeSpan.FromSeconds(retryOptions.Delay);
    }

    private RetryPolicy RetryPolicy
    {
        get
        {
            var delay = Backoff.DecorrelatedJitterBackoffV2(
                medianFirstRetryDelay: this.delay,
                retryCount: this.retryOptions.Count)
                    .Select(s => TimeSpan.FromTicks(Math.Min(s.Ticks, this.maxDelay.Ticks)));

            return Policy
                .Handle<MySqlException>()
                .Or<SocketException>()
                .WaitAndRetry(delay);
        }
    }

    public async Task<IReadOnlyCollection<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        using IDbConnection connection = this.CreateConnection();
        connection.Open();
        CommandDefinition command = new($"SELECT * FROM {GetTableName()}", cancellationToken: cancellationToken);

        IEnumerable<T> entities = await this.RetryPolicy.Execute(async () => await connection.QueryAsync<T>(command));

        return entities == null
            ? new List<T>()
            : entities.ToList();
    }

    public async Task<int> InsertAsync(T entity)
    {
        using IDbConnection connection = this.CreateConnection();
        connection.Open();

        return await this.RetryPolicy.Execute(async () => await connection.InsertAsync(entity));
    }

    private static string GetTableName() => DataObjectHelpers.GetTableName(typeof(T));

    private IDbConnection CreateConnection() => new MySqlConnection(this.connectionString);
}
