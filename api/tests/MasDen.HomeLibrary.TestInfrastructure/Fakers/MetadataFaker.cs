using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;
public class MetadataFaker : Faker<Metadata>
{
    public MetadataFaker(bool newInstance = true)
    {
        RuleFor(x => x.Id, setter => newInstance ? MetadataId.Empty : new MetadataId(this.FakerHub.Random.PositiveInt()));
        RuleFor(x => x.Pages, setter => setter.Random.PositiveInt());
        RuleFor(x => x.Year, setter => setter.Random.PositiveInt());
        RuleFor(x => x.Isbn, setter => setter.Random.PositiveInt().ToString());
    }

    public MetadataFaker WithBookId(BookId bookId)
    {
        RuleFor(x => x.BookId, setter => bookId);

        return this;
    }
}
