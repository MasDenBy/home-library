using MasDen.HomeLibrary.BookProcessor.Configuration;
using Microsoft.Extensions.Options;
using Rebus.Bus;
using Rebus.Config;
using Rebus.Retry.Simple;

namespace MasDen.HomeLibrary.BookProcessor;

public class BookWorker : IHostedService
{
    private readonly BookWorkerConfiguration configuration;
    private IBus? bus;
    private ServiceProvider? serviceProvider;

    public BookWorker(IOptions<BookWorkerConfiguration> configuration)
    {
        this.configuration = configuration.Value;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        var services = new ServiceCollection();
        services.AddRebus(
            rebus => rebus
               .Logging(l => l.Serilog())
            //.Routing(r => r.TypeBased().MapAssemblyOf<OnboardNewCustomer>("MainQueue"))
                .Transport(t => t.UseMySql(this.configuration.BooksDatabaseConnectionString, this.configuration.QueueTable, this.configuration.QueueName))
                .Options(t => t.SimpleRetryStrategy(errorQueueAddress: this.configuration.ErrorQueueName))
        );

        services.AutoRegisterHandlersFromAssemblyOf<BookWorker>();

        this.serviceProvider = services.BuildServiceProvider();
        this.serviceProvider.StartRebus();

        this.bus = this.serviceProvider.GetRequiredService<IBus>();

        return Task.CompletedTask;
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        if (this.serviceProvider != null)
        {
            await this.serviceProvider.DisposeAsync();
        }
    }
}