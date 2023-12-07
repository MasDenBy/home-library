using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;

public class BookFaker : Faker<Book>
{
    private List<LibraryId> libraryIds = new();

    public BookFaker(bool newInstance = true)
    {
        RuleFor(x => x.Id, setter => newInstance ? BookId.Empty : new BookId(this.FakerHub.Random.PositiveInt()));
        RuleFor(x => x.Title, setter => setter.Lorem.Sentence());
        RuleFor(x => x.Description, setter => setter.Lorem.Paragraph());
        RuleFor(x => x.Authors, setter => setter.Name.FullName());
        RuleFor(x => x.LibraryId, setter => this.libraryIds.Any() ? setter.PickRandom(this.libraryIds) : new LibraryId(setter.Random.Int(min: 0)));
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

    public BookFaker WithMetadata(Metadata metadata)
    {
        RuleFor(x => x.Metadata, setter => metadata);

        return this;
    }

    public BookFaker WithBookFile(BookFile bookFile)
    {
        RuleFor(x => x.File, setter => bookFile);

        return this;
    }
}
