using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;
public class EditionFaker : Faker<Edition>
{
    public EditionFaker(bool newInstance = true)
    {
        RuleFor(x => x.Id, setter => newInstance ? EditionId.Empty : new EditionId(this.FakerHub.Random.PositiveInt()));
        RuleFor(x => x.Title, setter => setter.Lorem.Sentence());
        RuleFor(x => x.Pages, setter => setter.Random.PositiveInt());
        RuleFor(x => x.Year, setter => setter.Random.PositiveInt());
        RuleFor(x => x.Isbn, setter => new Isbn(setter.Random.PositiveInt().ToString()));
        this.WithFilePath(this.FakerHub.System.FilePath());
    }

    public EditionFaker WithBookId(BookId bookId)
    {
        RuleFor(x => x.BookId, setter => bookId);

        return this;
    }

    public EditionFaker WithFilePath(string value)
    {
        RuleFor(x => x.FilePath, setter => value);

        return this;
    }
}
