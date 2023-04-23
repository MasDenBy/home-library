using System.Data;
using System.Net.Sockets;
using Dapper;
using MySqlConnector;
using Polly;
using Polly.Contrib.WaitAndRetry;

namespace MasDen.HomeLibrary.Database.Migrator;

internal static class DatabasePolicy
{
    public static T QuerySingleWithRetry<T>(this IDbConnection connection, string sql, object param = null!)
    {
        var maxDelay = TimeSpan.FromSeconds(120);

        var delay = Backoff.DecorrelatedJitterBackoffV2(medianFirstRetryDelay: TimeSpan.FromSeconds(5), retryCount: 15)
            .Select(s => TimeSpan.FromTicks(Math.Min(s.Ticks, maxDelay.Ticks)));

        var retryPolicy = Policy
            .Handle<MySqlException>()
            .Or<SocketException>()
            .WaitAndRetry(delay,
                (exception, timeSpan, retryCount) =>
                {
                    Console.WriteLine(exception);
                    Console.WriteLine($"QueryWithRetry: Error talking to Db, will retry after {timeSpan}. Retry attempt {retryCount.Count}");
                });

        return retryPolicy.Execute(() => connection.QuerySingle<T>(sql, param));
    }
}
