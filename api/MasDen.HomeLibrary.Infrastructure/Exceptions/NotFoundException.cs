using System.Runtime.Serialization;

namespace MasDen.HomeLibrary.Infrastructure.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException()
    {
    }

    public NotFoundException(string? message) : base(message)
    {
    }

    public NotFoundException(string? message, Exception? innerException) : base(message, innerException)
    {
    }

    public NotFoundException(Type type, long id)
        : base($"The {type.Name} with identifier {id} does not found.")
    { }

    protected NotFoundException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }
}
