using System.Reflection;
using Dapper.Contrib.Extensions;

namespace MasDen.HomeLibrary.Persistence;

internal static class DataObjectHelpers
{
    public static string GetTableName(Type entityType)
    {
        var table = entityType.GetTypeInfo().GetCustomAttribute<TableAttribute>();

        return table == null ? entityType.Name.ToLowerInvariant() : table.Name;
    }
}
