using FluentValidation;

namespace MasDen.HomeLibrary.BookProcessor.Configuration.Validators;

internal class BookWorkerConfigurationValidator : AbstractValidator<BookWorkerConfiguration>
{
    public BookWorkerConfigurationValidator()
    {
        RuleFor(x => x.BooksDatabaseConnectionString)
            .NotNull()
            .NotEmpty();

        RuleFor(x => x.QueueTable)
            .NotNull()
            .NotEmpty();

        RuleFor(x => x.QueueName)
            .NotNull()
            .NotEmpty();

        RuleFor(x => x.ErrorQueueName)
            .NotNull()
            .NotEmpty();
    }
}