using Bogus;
using MasDen.HomeLibrary.Domain.Entities;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;

public class LibraryFaker : Faker<Library>
{
    public LibraryFaker(bool newInstance = false)
    {
        CustomInstantiator(faker => new Library(
            id: newInstance ? 0 : faker.Random.PositiveInt(),
            path: faker.System.DirectoryPath()));
    }
}
