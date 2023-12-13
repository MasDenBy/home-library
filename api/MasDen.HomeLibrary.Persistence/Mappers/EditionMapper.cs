using MasDen.HomeLibrary.Domain;
using MasDen.HomeLibrary.Persistence.Entities;
using Riok.Mapperly.Abstractions;

namespace MasDen.HomeLibrary.Persistence.Mappers;
[Mapper]
internal partial class EditionMapper
{
	public partial Edition ToDomain(EditionEntity entity);
}
