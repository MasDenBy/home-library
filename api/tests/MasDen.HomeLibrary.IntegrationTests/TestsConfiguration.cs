using Microsoft.Extensions.Configuration;

namespace MasDen.HomeLibrary.IntegrationTests;
internal class TestsConfiguration
{
    [ConfigurationKeyName("DB_CONNECTION_STRING")]
    public string DatabaseConnectionString { get; set; } = null!;
}
