using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
    private readonly VevadaDbContext _dbContext;

    public UserSeeder(
        UserManager<User> userManager,
        IConfiguration configuration,
        ILogger<UserSeeder> logger,
        VevadaDbContext dbContext)
    {
        _userManager = userManager;
        _configuration = configuration;
        _logger = logger;
        _dbContext = dbContext;
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
            await EnsureAdminDetailsExist(existingUser.Id);
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

        await EnsureAdminDetailsExist(adminUser.Id);

        return 1;
    }

    private async Task EnsureAdminDetailsExist(int userId)
    {
        var detailsExist = await _dbContext.AdminDetails.AnyAsync(ad => ad.UserId == userId);

        if (!detailsExist)
        {
            var superAdminDetails = new AdminDetails
            {
                UserId = userId,
                FirstName = "System",
                LastName = "Administrator"
            };

            await _dbContext.AdminDetails.AddAsync(superAdminDetails);
            await _dbContext.SaveChangesAsync();
        }
    }
}
