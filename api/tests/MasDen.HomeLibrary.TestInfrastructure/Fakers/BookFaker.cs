using Bogus;
using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;

public class BookFaker : Faker<Book>
{
    private List<LibraryId> libraryIds = new();
    private List<FileId> fileIds = new();

    public BookFaker()
    {
        CustomInstantiator(faker => new Book(
            title: faker.Lorem.Sentence(),
            description: faker.Lorem.Paragraph(),
            authors: faker.Name.FullName(),
            fileId: this.fileIds.Any() ? faker.PickRandom(this.fileIds) : new FileId(faker.Random.Int(min: 0)),
            libraryId: this.libraryIds.Any() ? faker.PickRandom(this.libraryIds) : new LibraryId(faker.Random.Int(min: 0))));
    }

    public BookFaker WithRandomLibrary(IEnumerable<LibraryId> libraryIds)
    {
        this.libraryIds = libraryIds.ToList();

        return this;
    }

    public BookFaker WithRandomFile(IEnumerable<FileId> fileIds)
    {
        this.fileIds = fileIds.ToList();

        return this;
    }
}
