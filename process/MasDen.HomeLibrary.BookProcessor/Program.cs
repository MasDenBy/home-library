using IL.FluentValidation.Extensions.Options;
using MasDen.HomeLibrary.BookProcessor;
using MasDen.HomeLibrary.BookProcessor.Configuration;
using MasDen.HomeLibrary.BookProcessor.Configuration.Validators;

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((context, services) =>
    {
        services.AddOptions<BookWorkerConfiguration>()
            .BindConfiguration("BookWorker")
            .Validate(new BookWorkerConfigurationValidator())
            .ValidateOnStart();

        services.AddHostedService<BookWorker>();
    })
    .Build();

await host.RunAsync();
