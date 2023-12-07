using FluentValidation;

namespace MasDen.HomeLibrary.Books.Queries.DownloadBook;
public class DownloadBookValidator : AbstractValidator<DownloadBookQuery>
{
    public DownloadBookValidator()
    {
        RuleFor(x => x.Id.Value)
            .GreaterThan(0)
            .WithMessage("'Id' must be greater than '0'.");
    }
}
