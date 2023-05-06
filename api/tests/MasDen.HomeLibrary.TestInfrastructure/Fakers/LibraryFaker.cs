using Bogus;
using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;

public class LibraryFaker : Faker<Library>
{
    public LibraryFaker(bool newInstance = false)
    {
        CustomInstantiator(faker => new Library(
            id: newInstance ? LibraryId.Empty : new LibraryId(faker.Random.PositiveInt()),
            path: faker.System.DirectoryPath()));
    }
}
