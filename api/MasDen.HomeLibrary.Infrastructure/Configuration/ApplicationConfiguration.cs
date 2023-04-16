using Microsoft.Extensions.Configuration;

namespace MasDen.HomeLibrary.Infrastructure.Configuration;

public class ApplicationConfiguration
{
    [ConfigurationKeyName("DB_CONNECTION_STRING")]
    public string DatabaseConnectionString { get; set; } = null!;
}
