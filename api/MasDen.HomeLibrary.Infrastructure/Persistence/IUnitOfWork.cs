namespace MasDen.HomeLibrary.Infrastructure.Persistence;
public interface IUnitOfWork
{
    IBookDataStore Book { get; }
    ILibraryDataStore Library { get; }
    IMetadataDataStore Metadata { get; }
    IBookFileDataStore BookFile { get; }

    void BeginTransaction();
    void CommitTransaction();
    void RollbackTransaction();
}