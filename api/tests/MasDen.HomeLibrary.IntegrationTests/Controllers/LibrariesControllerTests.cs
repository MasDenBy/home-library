namespace MasDen.HomeLibrary.IntegrationTests.Controllers;

public class LibrariesControllerTests : IClassFixture<TestsFixture>
{
    private readonly TestsFixture fixture;

    public LibrariesControllerTests(TestsFixture fixture)
    {
        this.fixture = fixture;
    }

    [Fact]
    public async Task Get_ShouldResponse200OkWithLibrariesArray()
    {
        // Arrange
        var libraries = new LibraryFaker(true).GenerateBetween(1, 3);
        var expectedLibraries = await this.fixture.DataHelper.Library.InsertAsync(libraries);

        // Act
        var response = await this.fixture.HttpClient.GetAsync("/api/libraries");

        // Assert
        response.Should().Be200Ok().And.BeAs(expectedLibraries);
    }

    [Fact]
    public async Task Post_ShouldResponse201CreatedWithDto()
    {
        // Arrange
        var library = new LibraryFaker(true).Generate();

        // Act
        var response = await this.fixture.HttpClient.PostAsync($"/api/libraries?path={library.Path}", null);

        // Assert
        response.Should().Be201Created().And.BeAs(new { Path = library.Path });
        response.Should().HaveHeader("Location").And.NotBeEmpty();
    }
}
