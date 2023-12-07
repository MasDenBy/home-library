using MasDen.HomeLibrary.Infrastructure.Configuration;
using MasDen.HomeLibrary.Infrastructure.Processors.OpenLibrary;
using MasDen.HomeLibrary.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MasDen.HomeLibrary.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IImageService, ImageService>();

        services.AddSingleton(container =>
        {
            ApplicationConfiguration config = new();
            configuration.Bind(config);

            var validator = new ApplicationConfigurationValidator();
            var validationResult = validator.Validate(config);

            if (!validationResult.IsValid)
                throw new InvalidOperationException("Application configuration is invalid");

            return config;
        });

        services.AddHttpClient<OpenLibraryProcessor>(httpClient =>
        {
            httpClient.BaseAddress = new Uri("http://openlibrary.org");
        });

        return services;
    }
}
