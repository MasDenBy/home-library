using Bogus;

namespace MasDen.HomeLibrary.TestInfrastructure;

public static class BogusExtensions
{
    public static int PositiveInt(this Randomizer randomizer) => randomizer.Int(min: 1);
}
