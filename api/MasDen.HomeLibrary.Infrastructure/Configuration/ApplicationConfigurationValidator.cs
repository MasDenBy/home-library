using FluentValidation;

namespace MasDen.HomeLibrary.Infrastructure.Configuration;

internal class ApplicationConfigurationValidator : AbstractValidator<ApplicationConfiguration>
{
    public ApplicationConfigurationValidator()
    {
        RuleFor(x => x.DatabaseConnectionString)
            .NotNull()
            .NotEmpty();
    }
}
