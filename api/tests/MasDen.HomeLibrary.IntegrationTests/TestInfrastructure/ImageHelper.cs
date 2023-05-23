namespace MasDen.HomeLibrary.IntegrationTests.TestInfrastructure;
internal static class ImageHelper
{
    private static readonly Faker faker = new();

    public static async Task<string> SaveImageAsync(string imageName, string imageDirectory)
    {
        if(!Directory.Exists(imageDirectory))
        {
            Directory.CreateDirectory(imageDirectory);
        }

        var imageUrl = faker.Image.LoremFlickrUrl();

        var httpClient = new HttpClient();
        var content = await httpClient.GetByteArrayAsync(imageUrl);

        await File.WriteAllBytesAsync(Path.Combine(imageDirectory, imageName), content);

        return Convert.ToBase64String(content);
    }
}
