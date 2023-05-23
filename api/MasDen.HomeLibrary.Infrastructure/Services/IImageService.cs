using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.Infrastructure.Services;
public interface IImageService
{
    Task<string> GetImageContentAsync(LibraryId libraryId, string imageName);
}