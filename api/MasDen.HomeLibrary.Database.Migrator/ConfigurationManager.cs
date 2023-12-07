using System.Text.RegularExpressions;

namespace MasDen.HomeLibrary.Database.Migrator;

internal static class ConfigurationManager
{
    private static Regex envVariablePattern = new(@"(^[A-Z0-9_]+)(\=)(.*\n(?=[A-Z])|.*$)", RegexOptions.Compiled);

    private static MigrationOptions? migrationOptions = null;

    static ConfigurationManager()
    {
        var filePath = ".env";

        if (!File.Exists(filePath)) return;

        foreach (var line in File.ReadAllLines(filePath))
        {
            var matchResult = envVariablePattern.Match(line);

            if(!matchResult.Success)
                continue;

            Environment.SetEnvironmentVariable(matchResult.Groups[1].Value, matchResult.Groups[3].Value);
        }
    }

    public static MigrationOptions MigrationOptions => migrationOptions ??= new MigrationOptions
    {
        ConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? throw new InvalidOperationException("Connection String does not found in environment variables."),
        DatabaseName = Environment.GetEnvironmentVariable("DB_NAME") ?? throw new InvalidOperationException("Database name does not found in environment variables.")
    };
}
