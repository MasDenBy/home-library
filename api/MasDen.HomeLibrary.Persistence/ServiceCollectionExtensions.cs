using Dapper;
using Dapper.Contrib.Extensions;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Persistence.DataStores;
using Microsoft.Extensions.DependencyInjection;

namespace MasDen.HomeLibrary.Persistence;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPersistence(this IServiceCollection services)
    {
        services.AddScoped<IDataObjectFactory, DataObjectFactory>();

        services
            .AddScoped<IBookDataStore, BookDataStore>()
            .AddScoped<ILibraryDataStore, LibraryDataStore>();

        SqlMapperExtensions.TableNameMapper = entityType => DataObjectHelpers.GetTableName(entityType);
        SqlMapper.AddTypeHandler(new BookId.DapperTypeHandler());
        SqlMapper.AddTypeHandler(new FileId.DapperTypeHandler());
        SqlMapper.AddTypeHandler(new LibraryId.DapperTypeHandler());
        SqlMapper.AddTypeHandler(new MetadataId.DapperTypeHandler());

        return services;
    }
}
