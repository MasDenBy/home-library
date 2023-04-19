namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure.DataHelpers;
internal class DataHelper : IDisposable
{
    private readonly string connectionString;

    private LibraryDataHelper? libraryDataHelper;
    private bool disposed;

    public DataHelper(string connectionString)
    {
        this.connectionString = connectionString;
    }

    public LibraryDataHelper Library => this.libraryDataHelper ??= new LibraryDataHelper(this.connectionString);

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
            this.libraryDataHelper?.Dispose();
        }

        this.disposed = true;
    }
}
