using System.Reflection;
using Dapper;
using FluentMigrator.Runner;
using Microsoft.Extensions.DependencyInjection;
using MySql.Data.MySqlClient;

namespace MasDen.HomeLibrary.Database.Migrator;

internal class MigrationRunner
{
    public static void Run()
    {
        var services = CreateServices(ConfigurationManager.ConnectionString);
        EnsureDatabase(ConfigurationManager.ConnectionString, ConfigurationManager.DatabaseName);

        using var scope = services.CreateScope();
        var runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();

        runner.ListMigrations();
        runner.MigrateUp();
    }

    private static IServiceProvider CreateServices(string connectionString) =>
        new ServiceCollection()
            .AddFluentMigratorCore()
            .ConfigureRunner(runner =>
                runner.AddMySql5()
                      .WithGlobalConnectionString(connectionString)
                      .ScanIn(Assembly.GetExecutingAssembly()).For.Migrations())
            .AddLogging(log => log.AddFluentMigratorConsole())
            .BuildServiceProvider(false);

    private static void EnsureDatabase(string connectionString, string name)
    {
        using var connection = new MySqlConnection(ConnectionStringWithoutDatabase(connectionString, name));
        var records = connection.Query(
            sql: "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = @name",
            param: new
            {
                name
            });

        if (!records.Any())
        {
            connection.Execute($"CREATE DATABASE {name}");
        }

        static string ConnectionStringWithoutDatabase(string connectionString, string databaseName) =>
            connectionString.Replace($"Database={databaseName};", string.Empty);
    }
}
