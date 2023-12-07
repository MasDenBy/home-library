namespace MasDen.HomeLibrary.Database.Migrator;
public record MigrationOptions
{
	public string ConnectionString { get; init; } = null!;
	public string DatabaseName { get; init; } = null!;
}
