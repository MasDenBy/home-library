namespace MasDen.HomeLibrary.Persistence;
internal record RetryOptions(int Count, int Delay, int MaxDelay)
{
}
