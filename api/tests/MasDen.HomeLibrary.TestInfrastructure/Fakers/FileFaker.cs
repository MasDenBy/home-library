using Bogus;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;

public class FileFaker : Faker<Domain.Entities.File>
{
    public FileFaker()
    {
        CustomInstantiator(faker => new Domain.Entities.File(
            faker.System.FilePath(),
            faker.System.FileName()));
    }
}