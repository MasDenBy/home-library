using System.Text.RegularExpressions;

namespace MasDen.HomeLibrary.Database.Migrator;

internal static class ConfigurationManager
{
    private static Regex envVariablePattern = new(@"(^[A-Z0-9_]+)(\=)(.*\n(?=[A-Z])|.*$)", RegexOptions.Compiled);

    static ConfigurationManager()
    {
        var filePath = ".env";

        if (!File.Exists(filePath))
            throw new InvalidOperationException(".env file does not found.");

        foreach (var line in File.ReadAllLines(filePath))
        {
            var matchResult = envVariablePattern.Match(line);

            if(!matchResult.Success)
                continue;

            Environment.SetEnvironmentVariable(matchResult.Groups[1].Value, matchResult.Groups[3].Value);
        }
    }

    public static string ConnectionString => Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? throw new InvalidOperationException("Connection String does not found in environment variables.");
    public static string DatabaseName => Environment.GetEnvironmentVariable("DB_NAME") ?? throw new InvalidOperationException("Database name does not found in environment variables.");
}
