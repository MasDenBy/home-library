using System.Net.Sockets;
using MySqlConnector;
using Polly;
using Polly.Contrib.WaitAndRetry;
using Polly.Retry;

namespace MasDen.HomeLibrary.Persistence;

public static class Policies
{
    public static RetryPolicy CreateRetryPolicy(RetryOptions retryOptions)
    {
        IEnumerable<TimeSpan> delay = CreateDelay(retryOptions);

        return Policy
            .Handle<MySqlException>()
            .Or<SocketException>()
            .WaitAndRetry(delay);
    }

    public static AsyncRetryPolicy CreateAsyncRetryPolicy(RetryOptions retryOptions)
    {
        IEnumerable<TimeSpan> delay = CreateDelay(retryOptions);

        return Policy
            .Handle<MySqlException>()
            .Or<SocketException>()
            .WaitAndRetryAsync(delay);
    }

    private static IEnumerable<TimeSpan> CreateDelay(RetryOptions retryOptions)
    {
        var maxDelay = TimeSpan.FromSeconds(retryOptions.MaxDelay);

        return Backoff.DecorrelatedJitterBackoffV2(
                medianFirstRetryDelay: TimeSpan.FromSeconds(retryOptions.Delay),
                retryCount: retryOptions.Count)
                    .Select(s => TimeSpan.FromTicks(Math.Min(s.Ticks, maxDelay.Ticks)));
    }
}
