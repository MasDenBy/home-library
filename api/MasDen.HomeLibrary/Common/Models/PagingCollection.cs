namespace MasDen.HomeLibrary.Common.Models;

public class PagingCollection<T>
{
    public PagingCollection(IReadOnlyCollection<T> items, long total)
    {
        this.Items = items;
        this.Total = total;
    }

    public IReadOnlyCollection<T> Items { get; private set; }
    public long Total { get; private set; }
}
