using FluentValidation;

namespace MasDen.HomeLibrary.Libraries.Commands.DeleteLibrary;
public class DeleteLibraryCommandValidator : AbstractValidator<DeleteLibraryCommand>
{
    public DeleteLibraryCommandValidator()
    {
        RuleFor(x => x.Id.Value)
            .GreaterThan(0);
    }
}
