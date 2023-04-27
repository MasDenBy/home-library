namespace MasDen.HomeLibrary.Persistence;
public record RetryOptions(int Count, int Delay, int MaxDelay)
{
}
