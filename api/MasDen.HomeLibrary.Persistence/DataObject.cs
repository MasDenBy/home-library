using System.Data;
using Dapper;
using Dapper.Contrib.Extensions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MySqlConnector;

namespace MasDen.HomeLibrary.Persistence;

internal class DataObject<T> : IDataObject<T>
    where T : class
{
    private readonly string connectionString;

    public DataObject(string connectionString)
    {
        this.connectionString = connectionString;
    }

    public async Task<IReadOnlyCollection<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        using IDbConnection connection = this.CreateConnection();
        CommandDefinition command = new($"SELECT * FROM {GetTableName()}", cancellationToken: cancellationToken);
        connection.Open();

        IEnumerable<T> entities = await connection.QueryAsync<T>(command);

        return entities == null
            ? new List<T>()
            : entities.ToList();
    }

    public async Task<int> InsertAsync(T entity)
    {
        using IDbConnection connection = this.CreateConnection();
        connection.Open();

        return await connection.InsertAsync<T>(entity);
    }

    private static string GetTableName() => DataObjectHelpers.GetTableName(typeof(T));

    private IDbConnection CreateConnection() => new MySqlConnection(this.connectionString);
}
