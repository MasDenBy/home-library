namespace MasDen.HomeLibrary.BookProcessor.Configuration;

public class BookWorkerConfiguration
{
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    public string BooksDatabaseConnectionString { get; set; }
    public string QueueTable { get; set; }
    public string QueueName { get; set; }
    public string ErrorQueueName { get; set; }

#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
}
