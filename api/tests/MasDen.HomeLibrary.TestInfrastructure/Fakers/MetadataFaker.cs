using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;
public class MetadataFaker : Faker<Metadata>
{
    public MetadataFaker()
    {
        RuleFor(x => x.Id, setter => MetadataId.Empty);
        RuleFor(x => x.Pages, setter => setter.Random.PositiveInt());
        RuleFor(x => x.Year, setter => setter.Random.PositiveInt());
        RuleFor(x => x.Isbn, setter => setter.Random.PositiveInt().ToString());
    }
}
