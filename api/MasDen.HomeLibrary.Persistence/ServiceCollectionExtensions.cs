﻿using Dapper.Contrib.Extensions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Persistence.DataStores;
using Microsoft.Extensions.DependencyInjection;

namespace MasDen.HomeLibrary.Persistence;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPersistence(this IServiceCollection services)
    {
        services.AddScoped<IDataObjectFactory, DataObjectFactory>();

        services.AddScoped<ILibraryDataStore, LibraryDataStore>();

        SqlMapperExtensions.TableNameMapper = entityType => DataObjectHelpers.GetTableName(entityType);

        return services;
    }
}
