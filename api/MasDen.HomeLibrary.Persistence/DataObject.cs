using System.Data;
using Dapper;
using Dapper.Contrib.Extensions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MySqlConnector;
using Polly.Retry;

namespace MasDen.HomeLibrary.Persistence;

internal class DataObject<T> : IDataObject<T>
    where T : class
{
    private readonly string connectionString;
    private readonly RetryOptions retryOptions;

    public DataObject(string connectionString, RetryOptions retryOptions)
    {
        this.connectionString = connectionString;
        this.retryOptions = retryOptions;
    }

    private AsyncRetryPolicy AsyncRetryPolicy => Policies.CreateAsyncRetryPolicy(this.retryOptions);

    public async Task<IReadOnlyCollection<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        using IDbConnection connection = this.CreateConnection();
        connection.Open();
        CommandDefinition command = new($"SELECT * FROM {GetTableName()}", cancellationToken: cancellationToken);

        IEnumerable<T> entities = await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await connection.QueryAsync<T>(command));

        return entities == null
            ? new List<T>()
            : entities.ToList();
    }

    public async Task<int> InsertAsync(T entity)
    {
        using IDbConnection connection = this.CreateConnection();
        connection.Open();

        return await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await connection.InsertAsync(entity));
    }

    private static string GetTableName() => DataObjectHelpers.GetTableName(typeof(T));

    private IDbConnection CreateConnection() => new MySqlConnection(this.connectionString);
}
