using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Vevada.Data.Constants;
using Vevada.Data.Entities;

namespace Vevada.Data.Seeders;

public class UserSeeder : ISeeder
{
    public const int ExecutionOrder = RoleSeeder.ExecutionOrder + 1;

    public int Order => ExecutionOrder;

    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<UserSeeder> _logger;

    public UserSeeder(UserManager<User> userManager, IConfiguration configuration, ILogger<UserSeeder> logger)
    {
        _userManager = userManager;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<int> SeedAsync()
    {
        _logger.LogSeedingStarted(nameof(UserSeeder));

        var count = await SeedSuperAdmin();

        _logger.LogSeedingCompleted(nameof(UserSeeder), count);

        return count;
    }

    private async Task<int> SeedSuperAdmin()
    {
        var adminSettings = _configuration.GetSection("SuperAdminConfig");

        var email = adminSettings["Email"];
        var password = adminSettings["Password"];

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            _logger.LogWarning("SuperAdmin credentials are not set in configuration. Skipping SuperAdmin seeding.");
            return 0;
        }

        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null)
        {
            return 0;
        }

        var adminUser = new User
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true
        };

        var createUserResult = await _userManager.CreateAsync(adminUser, password);

        if (!createUserResult.Succeeded)
        {
            var errors = string.Join(", ", createUserResult.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to seed super admin: {errors}");
        }

        var addRoleResult = await _userManager.AddToRoleAsync(adminUser, AppRoles.SuperAdmin.Name!);

        if (!addRoleResult.Succeeded)
        {
            var errors = string.Join(", ", addRoleResult.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to assign super admin role: {errors}");
        }

        return 1;
    }
}
