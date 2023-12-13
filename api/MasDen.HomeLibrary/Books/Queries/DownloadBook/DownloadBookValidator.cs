using FluentValidation;

namespace MasDen.HomeLibrary.Books.Queries.DownloadBook;
public class DownloadBookValidator : AbstractValidator<DownloadBookQuery>
{
    public DownloadBookValidator()
    {
        RuleFor(x => x.EditionId.Value)
            .GreaterThan(0)
            .WithMessage("'EditionId' must be greater than '0'.");

        RuleFor(x => x.BookId.Value)
            .GreaterThan(0)
            .WithMessage("'BookId' must be greater than '0'.");
    }
}
