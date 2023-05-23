using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;

public class BookFaker : Faker<Book>
{
    private List<LibraryId> libraryIds = new();
    private List<Domain.Entities.File> files = new();
    private List<Metadata> metadatas = new();

    public BookFaker()
    {
        RuleFor(x => x.Id, setter => BookId.Empty);
        RuleFor(x => x.Title, setter => setter.Lorem.Sentence());
        RuleFor(x => x.Description, setter => setter.Lorem.Paragraph());
        RuleFor(x => x.Authors, setter => setter.Name.FullName());
        RuleFor(x => x.File, setter => this.files.Any() ? setter.PickRandom(this.files) : new FileFaker().Generate());
        RuleFor(x => x.Metadata, setter => this.metadatas.Any() ? setter.PickRandom(this.metadatas) : null);
        RuleFor(x => x.LibraryId, setter => this.libraryIds.Any() ? setter.PickRandom(this.libraryIds) : new LibraryId(setter.Random.Int(min: 0)));
    }

    public BookFaker WithRandomLibrary(IEnumerable<LibraryId> libraryIds)
    {
        this.libraryIds = libraryIds.ToList();

        return this;
    }

    public BookFaker WithRandomFile(IEnumerable<Domain.Entities.File> files)
    {
        this.files = files.ToList();

        return this;
    }

    public BookFaker WithRandomMetadata(IEnumerable<Metadata> metadatas)
    {
        this.metadatas = metadatas.ToList();

        return this;
    }
}
