using FluentValidation;

namespace MasDen.HomeLibrary.Books.Queries.Search;
public class SearchBooksQueryValidator : AbstractValidator<SearchBooksQuery>
{
    public SearchBooksQueryValidator()
    {
        RuleFor(x => x.Pattern)
            .NotEmpty()
            .NotNull();

        RuleFor(x => x.Count)
            .GreaterThan(0);

        RuleFor(x => x.Offset)
            .GreaterThanOrEqualTo(0);
    }
}
