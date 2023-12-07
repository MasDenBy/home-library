using MasDen.HomeLibrary.Database.Migrator;
using MasDen.HomeLibrary.Infrastructure.Configuration;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;
using MasDen.HomeLibrary.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using MySqlConnector;

namespace MasDen.HomeLibrary.IntegrationTests;

public class IntegrationTestsWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly MariaDbTestContainer mariaDbContainer;
    private ApplicationConfiguration? config = null;
    private DataHelper? dataHelper = null;
    private HttpClient? httpClient = null;

    public IntegrationTestsWebApplicationFactory()
    {
        this.mariaDbContainer = new MariaDbTestContainer();
    }

    internal DataHelper DataHelper => this.dataHelper ??= new DataHelper(this.Configuration);

    internal ApplicationConfiguration Configuration => this.config ??= this.Services.GetRequiredService<ApplicationConfiguration>();

    internal HttpClient HttpClient => this.httpClient ??= this.CreateClient();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration(configurationBuilder =>
        {
            var integrationConfig = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("testssettings.json")
                .AddInMemoryCollection(new Dictionary<string, string>
                {
                    { "DB_CONNECTION_STRING", this.mariaDbContainer.ConnectionString }
                })
                .Build();

            configurationBuilder.AddConfiguration(integrationConfig);
        });

        builder.ConfigureServices(services =>
        {
            MigrationRunner.Run(new MigrationOptions
            {
                ConnectionString = this.mariaDbContainer.ConnectionString,
                DatabaseName = "mariadb"
            });

            var dbConnectionWrapperServiceDescriptor = new ServiceDescriptor(
                typeof(IDbConnectionWrapper),
                new DbConnectionWrapper(new MySqlConnection(this.mariaDbContainer.ConnectionString)));

            services.Replace(dbConnectionWrapperServiceDescriptor);
        });
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        this.dataHelper?.Dispose();
        await this.mariaDbContainer.DisposeAsync();
    }

    public async Task InitializeAsync()
    {
        await this.mariaDbContainer.StartAsync();
    }
}
