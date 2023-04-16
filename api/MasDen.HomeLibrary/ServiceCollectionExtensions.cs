using System.Reflection;
using FluentValidation;
using MasDen.HomeLibrary.Common.Behaviours;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace MasDen.HomeLibrary;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddMediatR(cfg => {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
        });

        return services;
    }
}