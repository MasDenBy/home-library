using System.Runtime.Serialization;

namespace MasDen.HomeLibrary.Infrastructure.Exceptions;
public class DataMismatchException : Exception
{
    public DataMismatchException()
    {
    }

    public DataMismatchException(string? message) : base(message)
    {
    }

    public DataMismatchException(string? message, Exception? innerException) : base(message, innerException)
    {
    }

    protected DataMismatchException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }
}
