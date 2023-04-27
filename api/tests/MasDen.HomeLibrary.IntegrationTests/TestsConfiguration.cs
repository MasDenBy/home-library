﻿using Microsoft.Extensions.Configuration;

namespace MasDen.HomeLibrary.IntegrationTests;
internal class TestsConfiguration
{
    [ConfigurationKeyName("DB_CONNECTION_STRING")]
    public string DatabaseConnectionString { get; set; } = null!;
    [ConfigurationKeyName("DB_Retry_Count")]
    public int DatabaseRetryCount { get; set; }

    [ConfigurationKeyName("DB_Retry_MaxDelay")]
    public int DatabaseRetryMaxDelay { get; set; }

    [ConfigurationKeyName("DB_Retry_Delay")]
    public int DatabaseRetryDelay { get; set; }
}
