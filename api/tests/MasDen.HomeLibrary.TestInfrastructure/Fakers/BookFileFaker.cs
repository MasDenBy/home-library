using MasDen.HomeLibrary.Domain.Entities;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;

public class BookFileFaker : Faker<BookFile>
{
    public BookFileFaker(bool newInstance = true)
    {
        RuleFor(x => x.Id, setter => newInstance ? BookFileId.Empty : new BookFileId(this.FakerHub.Random.PositiveInt()));
        RuleFor(x => x.Path, setter => setter.System.FilePath());
        RuleFor(x => x.ImageName, setter => setter.System.FileName());
    }

    public IReadOnlyCollection<BookFile> GenerateForEachBook(IEnumerable<Book> books)
    {
        List<BookFile> result = new();

        foreach (var book in books)
        {
            this.WithBookId(book.Id);

            result.Add(this.Generate());
        }

        return result;
    }

    public BookFileFaker WithBookId(BookId bookId)
    {
        RuleFor(x => x.BookId, setter => bookId);

        return this;
    }
}