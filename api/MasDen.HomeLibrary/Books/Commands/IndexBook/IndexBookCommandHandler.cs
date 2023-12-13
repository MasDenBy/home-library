using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Infrastructure.Clients.OpenLibrary;
using MasDen.HomeLibrary.Infrastructure.Exceptions;
using MasDen.HomeLibrary.Infrastructure.Persistence;
using MediatR;

namespace MasDen.HomeLibrary.Books.Commands.IndexBook;
public class IndexBookCommandHandler : IRequestHandler<IndexBookCommand>
{
	private readonly IUnitOfWork unitOfWork;
    private readonly IOpenLibraryHttpClient openLibraryHttpClient;

    public IndexBookCommandHandler(IUnitOfWork unitOfWork, IOpenLibraryHttpClient openLibraryHttpClient)
    {
        this.unitOfWork = unitOfWork;
        this.openLibraryHttpClient = openLibraryHttpClient;
    }

    public async Task Handle(IndexBookCommand request, CancellationToken cancellationToken)
	{
        //var book = await this.unitOfWork.Book.GetBookAsync(request.Id, cancellationToken) ?? throw new NotFoundException(typeof(Book), request.Id.Value);

        //var isbn = book.Metadata?.Isbn;
        Isbn? isbn = null;

        if (isbn == null)
        {
            //isbn = await this.openLibraryHttpClient.FindIsbnAsync(book.Title);
            isbn = await this.openLibraryHttpClient.FindIsbnAsync("the kubernetes book");
        }

        if (isbn == null)
            return;

        var bookInfo = await this.openLibraryHttpClient.FindByIsbnAsync(isbn.Value);

        if (bookInfo == null) return;

        //book.Authors = bookInfo.details.authors?.map((x) => x.name).join(', ');
        //book.description = bookInfo.details.description?.value;
        //book.title = bookInfo.details.title;

        //if (!book.metadata)
        //{
        //    book.metadata = new Metadata();
        //}

        //book.metadata.isbn = isbn;
        //book.metadata.pages = bookInfo.details.number_of_pages;
        //book.metadata.year = bookInfo.details.publish_date;

        //if (bookInfo.thumbnail_url)
        //{
        //    const oldName = book.file.imageName;

        //    book.file.imageName = await this.imageService.download(
        //      bookInfo.thumbnail_url,
        //      book.file.library.id,
      
        //    );

        //    if (oldName) this.imageService.remove(oldName, book.file.library.id);
        //}

        //await this.dataStore.update(book);
    }
}
