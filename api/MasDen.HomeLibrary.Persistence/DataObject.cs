using Dapper;
using Dapper.Contrib.Extensions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MySqlConnector;
using Polly.Retry;
using System.Data;

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
        CommandDefinition command = new($"SELECT * FROM {GetTableName()}", cancellationToken: cancellationToken);

        IEnumerable<T> entities = await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await connection.QueryAsync<T>(command));

        return entities == null
            ? new List<T>()
            : entities.ToList();
    }

    public async Task<TId> InsertAsync<TId>(string insertSql, dynamic param)
    {
        using IDbConnection connection = this.CreateConnection();

        return await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await
                connection.QuerySingleAsync<TId>(
                    sql: $"{insertSql}; SELECT CAST(LAST_INSERT_ID() AS INT);",
                    param: param as object));
    }

    public async Task<bool> DeleteAsync(T entity)
    {
        using IDbConnection connection = this.CreateConnection();

        return await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await connection.DeleteAsync(entity));
    }

    public async Task<T> QuerySingleAsync(string where, dynamic param, CancellationToken cancellationToken = default)
    {
        using IDbConnection connection = this.CreateConnection();
        CommandDefinition command = new(
            $"SELECT * FROM {GetTableName()}" + (string.IsNullOrWhiteSpace(where) ? "" : $" WHERE {where}"),
            parameters: param as object,
            cancellationToken: cancellationToken);

        return await this.AsyncRetryPolicy.ExecuteAsync(async () => await connection.QuerySingleOrDefaultAsync<T>(command));
    }

    public async Task<(IReadOnlyCollection<T> entities, long total)> QueryPageAsync(string sql, dynamic param, CancellationToken cancellationToken = default)
    {
        using IDbConnection connection = this.CreateConnection();
        CommandDefinition command = new(sql, param as object, cancellationToken: cancellationToken);

        var reader = await this.AsyncRetryPolicy.ExecuteAsync(async () => await connection.QueryMultipleAsync(command));

        dynamic total = reader.Read().Single();
        var entities = reader.Read<T>();

        return (entities.ToList(), total.TotalCount);
    }

    public async Task<IEnumerable<TReturn>> QueryAsync<TFirst, TSecond, TThird, TReturn>(string sql, Func<TFirst, TSecond, TThird, TReturn> map, dynamic param, string splitOn = "Id", CancellationToken cancellationToken = default)
    {
        using IDbConnection connection = this.CreateConnection();
        CommandDefinition command = new(sql, param as object, cancellationToken: cancellationToken);

        return await this.AsyncRetryPolicy.ExecuteAsync(async () => await connection.QueryAsync<TFirst, TSecond, TThird, TReturn>(command, map, splitOn));
    }

    private static string GetTableName() => DataObjectHelpers.GetTableName(typeof(T));

    private IDbConnection CreateConnection() => new MySqlConnection(this.connectionString);
}
