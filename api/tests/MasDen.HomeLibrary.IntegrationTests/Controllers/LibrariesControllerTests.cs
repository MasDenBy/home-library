namespace MasDen.HomeLibrary.IntegrationTests.Controllers;

[Collection("Integration")]
public class LibrariesControllerTests : IClassFixture<IntegrationTestsWebApplicationFactory>
{
    private readonly IntegrationTestsWebApplicationFactory fixture;

    public LibrariesControllerTests(IntegrationTestsWebApplicationFactory fixture)
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
        response.Should().Be200Ok().And.BeAs(new Libraries.Queries.GetLibraries.LibraryMapper().ToDto(expectedLibraries));
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

    [Fact]
    public async Task Delete_ShouldResponse204NoContent()
    {
        // Arrange
        var library = new LibraryFaker(true).Generate();
        var added = await this.fixture.DataHelper.Library.InsertAsync(library);

        // Act
        var response = await this.fixture.HttpClient.DeleteAsync($"/api/libraries/{added.Id}");

        // Assert
        response.Should().Be204NoContent();

        var exists = await this.fixture.DataHelper.Library.ExistsAsync(added.Id);

        exists.Should().BeFalse();
    }
}
