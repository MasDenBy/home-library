using FluentValidation;

namespace MasDen.HomeLibrary.Books.Commands.UpdateBook;
public class UpdateBookCommandValidator : AbstractValidator<UpdateBookCommand>
{
    public UpdateBookCommandValidator()
    {
        RuleFor(x => x.Id.Value)
            .GreaterThan(0);

        RuleFor(x => x.Title)
            .MaximumLength(1000)
            .NotEmpty()
            .NotNull();

        RuleFor(x => x.Description)
            .MaximumLength(4000);

        RuleFor(x => x.Authors)
            .MaximumLength(255);

#pragma warning disable CS8602 // Dereference of a possibly null reference.
        RuleFor(x => x.Edition.Year)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Edition != null);

        RuleFor(x => x.Edition.Pages)
            .GreaterThan(0)
            .When(x => x.Edition != null);

        RuleFor(x => x.Edition.Id.Value)
            .GreaterThan(0)
            .When(x => x.Edition != null);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
    }
}