using System.Data;
using Dapper;
using MasDen.HomeLibrary.Infrastructure.Persistence;

namespace MasDen.HomeLibrary.Persistence;

public class DbConnectionWrapper : IDbConnectionWrapper, IDisposable
{
    private readonly IDbConnection connection;

    private IDbTransaction? transaction;
    private bool disposed;

    public DbConnectionWrapper(IDbConnection connection)
    {
        this.connection = connection;
    }

    public IDbConnection Connection => this.connection;
    private IDbTransaction? Transaction => this.transaction?.Connection == null ? null : this.transaction;

    public void BeginTransaction()
    {
        if(this.connection.State != ConnectionState.Open)
            this.connection.Open();

        this.transaction = this.connection.BeginTransaction();
    }

    public void CommitTransaction() => this.Transaction?.Commit();
    public void RollbackTransaction() => this.Transaction?.Rollback();

    public CommandDefinition CreateCommand(string sql, CancellationToken cancellationToken = default) =>
        new(sql, transaction: this.Transaction, cancellationToken: cancellationToken);

    public CommandDefinition CreateCommand(string sql, dynamic param, CancellationToken cancellationToken = default) =>
        new(sql, parameters: param as object, transaction: this.Transaction, cancellationToken: cancellationToken);

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
            this.connection?.Close();
            this.connection?.Dispose();
            this.transaction?.Dispose();
        }

        this.disposed = true;
    }
}
