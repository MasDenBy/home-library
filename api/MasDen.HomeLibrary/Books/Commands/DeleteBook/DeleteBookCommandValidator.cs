using FluentValidation;

namespace MasDen.HomeLibrary.Books.Commands.DeleteBook;
public class DeleteBookCommandValidator : AbstractValidator<DeleteBookCommand>
{
    public DeleteBookCommandValidator()
    {
        RuleFor(x => x.Id.Value)
            .GreaterThan(0);
    }
}
