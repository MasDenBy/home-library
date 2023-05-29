using System.Data;
using Dapper;

namespace MasDen.HomeLibrary.Infrastructure.Persistence;
public interface IDbConnectionWrapper
{
    IDbConnection Connection { get; }

    void BeginTransaction();
    void CommitTransaction();
    CommandDefinition CreateCommand(string sql, CancellationToken cancellationToken = default);
    CommandDefinition CreateCommand(string sql, dynamic param, CancellationToken cancellationToken = default);
    void RollbackTransaction();
}