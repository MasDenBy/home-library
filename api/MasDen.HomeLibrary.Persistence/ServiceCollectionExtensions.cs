using Dapper;
using Dapper.Contrib.Extensions;
using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Configuration;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using MySqlConnector;

namespace MasDen.HomeLibrary.Persistence;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPersistence(this IServiceCollection services)
    {
        services.AddScoped<IDbConnectionWrapper>(s =>
        {
            var configuration = s.GetRequiredService<ApplicationConfiguration>();

            return new DbConnectionWrapper(new MySqlConnection(configuration.DatabaseConnectionString));
        });

        services.AddScoped<IDataObjectFactory, DataObjectFactory>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        SqlMapperExtensions.TableNameMapper = entityType => DataObjectHelpers.GetTableName(entityType);
        SqlMapper.AddTypeHandler(new BookId.DapperTypeHandler());
        SqlMapper.AddTypeHandler(new LibraryId.DapperTypeHandler());
        SqlMapper.AddTypeHandler(new EditionId.DapperTypeHandler());
        SqlMapper.AddTypeHandler(new Isbn.DapperTypeHandler());

        return services;
    }
}
