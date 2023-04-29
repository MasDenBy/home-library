using Bogus;

namespace MasDen.HomeLibrary.TestInfrastructure;

internal static class BogusExtensions
{
    public static int PositiveInt(this Randomizer randomizer) => randomizer.Int(min: 1);
}
