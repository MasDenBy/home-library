using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;

public class LibraryFaker : Faker<Library>
{
    public LibraryFaker(bool newInstance = true)
    {
        RuleFor(x => x.Id, setter => newInstance ? LibraryId.Empty : new LibraryId(setter.Random.PositiveInt()));
        RuleFor(x => x.Path, setter => setter.System.DirectoryPath());
    }
}
