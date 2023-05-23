using MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MasDen.HomeLibrary.IntegrationTests;

public class TestsFixture : IDisposable
{
    private readonly IntegrationTestsWebApplicationFactory factory;
    private readonly TestsConfiguration config;
    private readonly DataHelper dataHelper;

    private bool disposed;

    public TestsFixture()
    {
        this.factory = new IntegrationTestsWebApplicationFactory();

        var configuration = this.factory.Services.GetRequiredService<IConfiguration>();
        this.config = new TestsConfiguration();

        configuration.Bind(this.config);

        this.dataHelper = new DataHelper(this.config);
    }

    internal HttpClient HttpClient => this.factory.CreateClient();
    internal IntegrationTestsWebApplicationFactory Factory => this.factory;
    internal DataHelper DataHelper => this.dataHelper;
    internal TestsConfiguration Configuration => this.config;

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
            this.dataHelper?.Dispose();
            this.factory?.Dispose();
        }

        this.disposed = true;
    }
}
