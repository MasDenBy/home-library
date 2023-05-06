using FluentValidation;

namespace MasDen.HomeLibrary.Books.Queries.GetBooks;
public class GetBooksQueryValidator : AbstractValidator<GetBooksQuery>
{
    public GetBooksQueryValidator()
    {
        RuleFor(x => x.Count)
            .GreaterThan(0);

        RuleFor(x => x.Offset)
            .GreaterThanOrEqualTo(0);
    }
}
