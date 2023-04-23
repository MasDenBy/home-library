FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env

WORKDIR /App
COPY ./api/MasDen.HomeLibrary.Database.Migrator ./


RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/runtime:6.0
WORKDIR /App
COPY --from=build-env /App/out .
ENTRYPOINT ["dotnet", "MasDen.HomeLibrary.Database.Migrator.dll"]