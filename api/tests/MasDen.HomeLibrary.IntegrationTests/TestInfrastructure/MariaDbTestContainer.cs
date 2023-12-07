using Testcontainers.MariaDb;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure;
internal class MariaDbTestContainer
{
    private readonly MariaDbContainer container;

    public MariaDbTestContainer()
    {
        this.container = new MariaDbBuilder()
            .WithImage("mariadb:latest")
            .Build();
    }

    public string ConnectionString => this.container.GetConnectionString();
    public Task StartAsync() => this.container.StartAsync();
    public ValueTask DisposeAsync() => this.container.DisposeAsync();
}
