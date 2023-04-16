using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Reflection;
using Dapper;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MySql.Data.MySqlClient;

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

    private static string GetTableName()
    {
        var table = typeof(T).GetTypeInfo().GetCustomAttribute<TableAttribute>();

        return table == null ? typeof(T).Name.ToLowerInvariant() : table.Name;
    }

    private IDbConnection CreateConnection() => new MySqlConnection(this.connectionString);
}
