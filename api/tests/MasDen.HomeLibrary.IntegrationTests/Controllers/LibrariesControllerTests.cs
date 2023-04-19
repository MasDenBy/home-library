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
}
