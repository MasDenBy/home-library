using FluentValidation;

namespace MasDen.HomeLibrary.Books.Commands.IndexBook;
public class IndexBookCommandValidator : AbstractValidator<IndexBookCommand>
{
	public IndexBookCommandValidator()
	{
		RuleFor(x => x.Id.Value)
			.GreaterThan(0);
	}
}
