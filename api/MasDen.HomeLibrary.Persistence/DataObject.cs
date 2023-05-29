using System.Data;
using Dapper;
using Dapper.Contrib.Extensions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using Polly.Retry;

namespace MasDen.HomeLibrary.Persistence;

internal class DataObject<T> : IDataObject<T>
    where T : class
{
    private readonly IDbConnectionWrapper connectionWrapper;
    private readonly RetryOptions retryOptions;

    public DataObject(IDbConnectionWrapper connectionWrapper, RetryOptions retryOptions)
    {
        this.connectionWrapper = connectionWrapper;
        this.retryOptions = retryOptions;
    }

    private AsyncRetryPolicy AsyncRetryPolicy => Policies.CreateAsyncRetryPolicy(this.retryOptions);

    public async Task<IReadOnlyCollection<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        IDbConnection? connection = this.CreateConnection();
        var command = this.connectionWrapper.CreateCommand($"SELECT * FROM {GetTableName()}", cancellationToken: cancellationToken);

        IEnumerable<T> entities = await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await connection.QueryAsync<T>(command));

        return entities == null
            ? new List<T>()
            : entities.ToList();
    }

    public async Task<TId> InsertAsync<TId>(string insertSql, dynamic param)
    {
        CommandDefinition command = this.connectionWrapper.CreateCommand($"{insertSql}; SELECT CAST(LAST_INSERT_ID() AS INT);", param);

        return await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await
                this.CreateConnection().ExecuteScalarAsync<TId>(command));
    }

    public async Task<bool> DeleteAsync(T entity)
    {
        IDbConnection? connection = this.CreateConnection();

        return await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await connection.DeleteAsync(entity));
    }

    public async Task<T> QuerySingleAsync(string where, dynamic param, CancellationToken cancellationToken = default)
    {
        IDbConnection? connection = this.CreateConnection();
        CommandDefinition command = new(
            $"SELECT * FROM {GetTableName()}" + (string.IsNullOrWhiteSpace(where) ? "" : $" WHERE {where}"),
            parameters: param as object,
            cancellationToken: cancellationToken);

        return await this.AsyncRetryPolicy.ExecuteAsync(async () => await connection.QuerySingleOrDefaultAsync<T>(command));
    }

    public async Task<(IReadOnlyCollection<T> entities, long total)> QueryPageAsync(string sql, dynamic param, CancellationToken cancellationToken = default)
    {
        IDbConnection? connection = this.CreateConnection();
        CommandDefinition command = new(sql, param as object, cancellationToken: cancellationToken);

        var reader = await this.AsyncRetryPolicy.ExecuteAsync(async () => await connection.QueryMultipleAsync(command));

        dynamic total = reader.Read().Single();
        var entities = reader.Read<T>();

        return (entities.ToList(), total.TotalCount);
    }

    public async Task<IEnumerable<TReturn>> QueryAsync<TFirst, TSecond, TThird, TReturn>(string sql, Func<TFirst, TSecond, TThird, TReturn> map, dynamic param, string splitOn = "Id", CancellationToken cancellationToken = default)
    {
        IDbConnection? connection = this.CreateConnection();
        CommandDefinition command = new(sql, param as object, cancellationToken: cancellationToken);

        return await this.AsyncRetryPolicy.ExecuteAsync(async () => await connection.QueryAsync<TFirst, TSecond, TThird, TReturn>(command, map, splitOn));
    }

    public async Task<int> ExecuteAsync(string sql, dynamic param, CancellationToken cancellationToken = default)
    {
        CommandDefinition command = this.connectionWrapper.CreateCommand(sql, param, cancellationToken);

        var rows = await this.AsyncRetryPolicy
            .ExecuteAsync(async () => await
                this.CreateConnection().ExecuteAsync(command));

        return rows;
    }

    private static string GetTableName() => DataObjectHelpers.GetTableName(typeof(T));

    public IDbConnection? CreateConnection() => this.connectionWrapper.Connection;
}
