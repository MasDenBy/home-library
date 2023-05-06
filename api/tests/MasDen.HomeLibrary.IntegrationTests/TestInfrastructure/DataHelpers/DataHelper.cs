namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;

internal class DataHelper : IDisposable
{
    private readonly TestsConfiguration configuration;

    private BookDataHelper? bookDataHelper;
    private FileDataHelper? fileDataHelper;
    private LibraryDataHelper? libraryDataHelper;

    private bool disposed;

    public DataHelper(TestsConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public BookDataHelper Book => this.bookDataHelper ??= new BookDataHelper(this.configuration);
    public FileDataHelper File => this.fileDataHelper ??= new FileDataHelper(this.configuration);
    public LibraryDataHelper Library => this.libraryDataHelper ??= new LibraryDataHelper(this.configuration);

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
            this.fileDataHelper?.Dispose();
            this.libraryDataHelper?.Dispose();
        }

        this.disposed = true;
    }
}
