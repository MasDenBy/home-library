using MasDen.HomeLibrary.Domain.StronglyTypedIds;
using MasDen.HomeLibrary.Infrastructure.Configuration;

namespace MasDen.HomeLibrary.Infrastructure.Services;
public class ImageService : IImageService
{
    private readonly string imageDirectory;

    public ImageService(ApplicationConfiguration configuration)
    {
        this.imageDirectory = configuration.ImageDirectory;
    }

    public async Task<string> GetImageContentAsync(LibraryId libraryId, string imageName)
    {
        ArgumentNullException.ThrowIfNull(imageName);

        var imagePath = this.GetImagePath(libraryId, imageName);
        var bytes = await File.ReadAllBytesAsync(imagePath);

        return Convert.ToBase64String(bytes);
    }

    private string GetImagePath(LibraryId libraryId, string imageName) => Path.Combine(this.imageDirectory, libraryId.ToString(), imageName);
}
