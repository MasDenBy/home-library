using FluentMigrator;

namespace MasDen.HomeLibrary.Database.Migrator.Migrations;

[Migration(1)]
public class Migration01_Initial : Migration
{
    public override void Down()
    {
        Delete.Table("book");
        Delete.Table("metadata");
        Delete.Table("file");
        Delete.Table("library");
    }

    public override void Up()
    {
        Create.Table("library")
            .WithColumn("id").AsInt32().NotNullable().PrimaryKey().Identity()
            .WithColumn("path").AsString(500).NotNullable();

        Create.Table("file")
            .WithColumn("id").AsInt32().NotNullable().PrimaryKey().Identity()
            .WithColumn("path").AsString(500).NotNullable()
            .WithColumn("imageName").AsString(30)
            .WithColumn("libraryId").AsInt32().NotNullable().ForeignKey("library", "id");

        Create.Table("metadata")
            .WithColumn("id").AsInt32().NotNullable().PrimaryKey().Identity()
            .WithColumn("isbn").AsString(13)
            .WithColumn("pages").AsInt32()
            .WithColumn("year").AsString(255);

        Create.Table("book")
            .WithColumn("id").AsInt32().NotNullable().PrimaryKey().Identity()
            .WithColumn("title").AsString(1000).NotNullable()
            .WithColumn("description").AsString(4000)
            .WithColumn("authors").AsString(255)
            .WithColumn("fileId").AsInt32().ForeignKey("file", "id")
            .WithColumn("metadataId").AsInt32().ForeignKey("metadata", "id");
    }
}
