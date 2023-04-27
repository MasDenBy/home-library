using FluentValidation;

namespace MasDen.HomeLibrary.Infrastructure.Configuration;

internal class ApplicationConfigurationValidator : AbstractValidator<ApplicationConfiguration>
{
    public ApplicationConfigurationValidator()
    {
        RuleFor(x => x.DatabaseConnectionString)
            .NotNull()
            .NotEmpty();

        RuleFor(x => x.DatabaseRetryCount)
            .GreaterThan(0);

        RuleFor(x => x.DatabaseRetryMaxDelay)
            .GreaterThan(0);

        RuleFor(x => x.DatabaseRetryDelay)
            .GreaterThan(0);
    }
}
