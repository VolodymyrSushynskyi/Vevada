using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Vevada.Data.Constants;
using Vevada.Data.Entities;

namespace Vevada.Data.Seeders;

public class UserSeeder : ISeeder
{
    public const int ExecutionOrder = RoleSeeder.ExecutionOrder + 1;

    public int Order => ExecutionOrder;

    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;

    public UserSeeder(UserManager<User> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<int> SeedAsync()
    {
        return await SeedSuperAdmin();
    }

    private async Task<int> SeedSuperAdmin()
    {
        var adminSettings = _configuration.GetSection("SuperAdminConfig");

        var email = adminSettings["Email"];
        var password = adminSettings["Password"];

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
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
            // TODO: Log the errors in result.Errors for debugging
            return 0;
        }

        var addRoleResult = await _userManager.AddToRoleAsync(adminUser, AppRoles.SuperAdmin.Name!);

        if (!addRoleResult.Succeeded)
        {
            // TODO: Log the errors in result.Errors for debugging
            return 0;
        }

        return 1;
    }
}

