using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;

public class LibraryFaker : Faker<Library>
{
    public LibraryFaker(bool newInstance = true)
    {
        CustomInstantiator(x => new Library(
            newInstance ? LibraryId.Empty : new LibraryId(this.FakerHub.Random.PositiveInt()),
            this.FakerHub.System.DirectoryPath()));
    }
}
