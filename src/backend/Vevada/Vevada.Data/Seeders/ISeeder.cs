namespace Vevada.Data.Seeders;

public interface ISeeder
{
    int Order { get; }
    Task<int> SeedAsync();
}
