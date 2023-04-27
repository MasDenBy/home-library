using FluentValidation;

namespace MasDen.HomeLibrary.Libraries.Commands.CreateLibrary;

public class CreateLibraryCommandValidator : AbstractValidator<CreateLibraryCommand>
{
    public CreateLibraryCommandValidator()
    {
        RuleFor(x => x.Path)
            .MaximumLength(500)
            .NotNull()
            .NotEmpty();
    }
}
