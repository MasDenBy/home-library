using FluentValidation;

namespace MasDen.HomeLibrary.Books.Queries.GetBook;

public class GetBookQueryValidator : AbstractValidator<GetBookQuery>
{
    public GetBookQueryValidator()
    {
        RuleFor(x => x.BookId.Value)
            .GreaterThan(0);
    }
}
