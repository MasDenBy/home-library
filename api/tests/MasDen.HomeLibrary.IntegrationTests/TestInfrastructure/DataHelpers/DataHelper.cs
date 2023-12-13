using MasDen.HomeLibrary.Infrastructure.Configuration;

namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;

internal class DataHelper : IDisposable
{
    private readonly ApplicationConfiguration configuration;

    private BookDataHelper? bookDataHelper;
    private LibraryDataHelper? libraryDataHelper;
    private EditionDataHelper? metadataDataHelper;

    private bool disposed;

    public DataHelper(ApplicationConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public BookDataHelper Book => this.bookDataHelper ??= new BookDataHelper(this.configuration);
    public LibraryDataHelper Library => this.libraryDataHelper ??= new LibraryDataHelper(this.configuration);
    public EditionDataHelper Edition => this.metadataDataHelper ??= new EditionDataHelper(this.configuration);

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (this.disposed) return;

        if (disposing)
        {
            this.bookDataHelper?.Dispose();
            this.libraryDataHelper?.Dispose();
            this.metadataDataHelper?.Dispose();
        }

        this.disposed = true;
    }
}
