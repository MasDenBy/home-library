using MasDen.HomeLibrary;
using MasDen.HomeLibrary.Infrastructure;
using MasDen.HomeLibrary.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .AddEnvironmentVariables()
    .AddUserSecrets<Program>();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddPersistence();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }