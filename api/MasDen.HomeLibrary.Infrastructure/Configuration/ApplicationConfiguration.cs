using Microsoft.Extensions.Configuration;

namespace MasDen.HomeLibrary.Infrastructure.Configuration;

public class ApplicationConfiguration
{
    [ConfigurationKeyName("DB_CONNECTION_STRING")]
    public string DatabaseConnectionString { get; set; } = null!;

    [ConfigurationKeyName("DB_Retry_Count")]
    public int DatabaseRetryCount { get; set; }

    [ConfigurationKeyName("DB_Retry_MaxDelay")]
    public int DatabaseRetryMaxDelay { get; set; }

    [ConfigurationKeyName("DB_Retry_Delay")]
    public int DatabaseRetryDelay { get; set; }

    [ConfigurationKeyName("IMAGE_DIR")]
    public string ImageDirectory { get; init; } = null!;
}
