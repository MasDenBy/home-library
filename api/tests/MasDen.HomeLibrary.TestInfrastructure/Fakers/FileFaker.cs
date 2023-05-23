using Bogus;
using MasDen.HomeLibrary.Domain.StronglyTypedIds;

namespace MasDen.HomeLibrary.TestInfrastructure.Fakers;

public class FileFaker : Faker<Domain.Entities.File>
{
    public FileFaker()
    {
        RuleFor(x => x.Id, setter => FileId.Empty);
        RuleFor(x => x.Path, setter => setter.System.FilePath());
        RuleFor(x => x.ImageName, setter => setter.System.FileName());
    }
}