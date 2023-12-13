﻿using MasDen.HomeLibrary.Infrastructure.Persistence;
using MasDen.HomeLibrary.Persistence.DataStores;

namespace MasDen.HomeLibrary.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly IDataObjectFactory dataObjectFactory;
    private readonly IDbConnectionWrapper connectionWrapper;

    private IBookDataStore bookDataStore;
    private ILibraryDataStore libraryDataStore;
    private IEditionDataStore metadataDataStore;

#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    public UnitOfWork(IDataObjectFactory dataObjectFactory, IDbConnectionWrapper connectionWrapper)
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    {
        this.dataObjectFactory = dataObjectFactory;
        this.connectionWrapper = connectionWrapper;
    }

    public IBookDataStore Book => this.bookDataStore ??= new BookDataStore(this.dataObjectFactory);
    public ILibraryDataStore Library => this.libraryDataStore ??= new LibraryDataStore(this.dataObjectFactory);
    public IEditionDataStore Edition => this.metadataDataStore ??= new EditionDataStore(this.dataObjectFactory);

    public void BeginTransaction() => this.connectionWrapper.BeginTransaction();
    public void CommitTransaction() => this.connectionWrapper.CommitTransaction();
    public void RollbackTransaction() => this.connectionWrapper.RollbackTransaction();
}
