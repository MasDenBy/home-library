namespace MasDen.HomeLibrary.Infrastructure.Persistence;
public interface IUnitOfWork
{
    IBookDataStore Book { get; }
    ILibraryDataStore Library { get; }
    IEditionDataStore Edition { get; }

    void BeginTransaction();
    void CommitTransaction();
    void RollbackTransaction();
}