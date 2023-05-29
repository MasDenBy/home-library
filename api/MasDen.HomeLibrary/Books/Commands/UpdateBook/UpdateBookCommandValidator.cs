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
        RuleFor(x => x.Metadata.Year)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Metadata != null);

        RuleFor(x => x.Metadata.Isbn)
            .MaximumLength(13)
            .When(x => x.Metadata != null);

        RuleFor(x => x.Metadata.Pages)
            .GreaterThan(0)
            .When(x => x.Metadata != null);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
    }
}