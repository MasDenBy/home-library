using FluentMigrator;

namespace MasDen.HomeLibrary.Database.Migrator.Migrations;

[Migration(1)]
public class Migration01_Initial : Migration
{
    public override void Down()
    {
        Delete.Table("book");
        Delete.Table("metadata");
        Delete.Table("bookfile");
        Delete.Table("library");
    }

    public override void Up()
    {
        Create.Table("library")
            .WithColumn("id").AsInt32().NotNullable().PrimaryKey().Identity()
            .WithColumn("path").AsString(500).NotNullable();

        Create.Table("book")
            .WithColumn("id").AsInt32().NotNullable().PrimaryKey().Identity()
            .WithColumn("title").AsString(1000).NotNullable()
            .WithColumn("description").AsString(4000).Nullable()
            .WithColumn("authors").AsString(255).Nullable()
            .WithColumn("libraryId").AsInt32().NotNullable().ForeignKey("library", "id");

        Create.Table("bookfile")
            .WithColumn("id").AsInt32().NotNullable().PrimaryKey().Identity()
            .WithColumn("path").AsString(500).NotNullable()
            .WithColumn("imageName").AsString(100).Nullable()
            .WithColumn("bookId").AsInt32().NotNullable().ForeignKey("book", "id");

        Create.Table("metadata")
            .WithColumn("id").AsInt32().NotNullable().PrimaryKey().Identity()
            .WithColumn("isbn").AsString(13).Nullable()
            .WithColumn("pages").AsInt32().Nullable()
            .WithColumn("year").AsInt32().Nullable()
            .WithColumn("bookId").AsInt32().NotNullable().ForeignKey("book", "id");
    }
}
