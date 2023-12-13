using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Persistence.Entities;
using Riok.Mapperly.Abstractions;

namespace MasDen.HomeLibrary.Persistence.Mappers;

[Mapper]
public partial class BookMapper
{
	public partial Book ToDomain(BookEntity entity);
	public partial IReadOnlyCollection<Book> ToDomain(IEnumerable<BookEntity> entities);
}
