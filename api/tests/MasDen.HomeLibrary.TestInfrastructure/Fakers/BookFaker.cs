using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;

public class BookFaker : Faker<Book>
{
    private List<LibraryId> libraryIds = new();

    public BookFaker(bool newInstance = true)
    {
        CustomInstantiator(x => new Book(
             id: newInstance ? BookId.Empty : new BookId(this.FakerHub.Random.PositiveInt()),
             title: this.FakerHub.Lorem.Sentence(),
             description: this.FakerHub.Lorem.Paragraph(),
             authors: this.FakerHub.Name.FullName(),
             editions: new[] { new EditionFaker().Generate() },
             libraryId: this.libraryIds.Any() ? this.FakerHub.PickRandom(this.libraryIds) : new LibraryId(this.FakerHub.Random.Int(min: 0)),
             imageName: this.FakerHub.System.CommonFileName()));
    }

    public BookFaker WithRandomLibrary(IEnumerable<LibraryId> libraryIds)
    {
        this.libraryIds = libraryIds.ToList();

        return this;
    }

    public BookFaker WithLibrary(LibraryId libraryId)
    {
        this.libraryIds.Add(libraryId);

        return this;
    }

    public BookFaker WithEditions(Edition[] editions)
    {
        RuleFor(x => x.Editions, setter => editions);

        return this;
    }
}
