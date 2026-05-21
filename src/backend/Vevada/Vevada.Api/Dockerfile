# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore
COPY ["Vevada.Api/Vevada.Api.csproj", "Vevada.Api/"]
COPY ["Vevada.Business/Vevada.Business.csproj", "Vevada.Business/"]
COPY ["Vevada.Data/Vevada.Data.csproj", "Vevada.Data/"]
RUN dotnet restore "Vevada.Api/Vevada.Api.csproj"

# Copy everything else and publish
COPY . .
WORKDIR "/src/Vevada.Api"
RUN dotnet publish "Vevada.Api.csproj" -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Vevada.Api.dll"]