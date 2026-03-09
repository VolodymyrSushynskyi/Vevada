using Microsoft.AspNetCore.Identity;
using Vevada.Data.Constants;
using Vevada.Data.Entities;

namespace Vevada.Data.Seeders;

public class RoleSeeder : ISeeder
{
    public const int ExecutionOrder = 1;
    public int Order => ExecutionOrder;

    private readonly RoleManager<Role> _roleManager;

    public RoleSeeder(RoleManager<Role> roleManager)
    {
        _roleManager = roleManager;
    }

    public async Task<int> SeedAsync()
    {
        int seededCount = 0;

        foreach (var role in AppRoles.All)
        {
            if (!await _roleManager.RoleExistsAsync(role.Name!))
            {
                var result = await _roleManager.CreateAsync(role);

                if (result.Succeeded)
                {
                    seededCount++;
                }
                else
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to seed role {role.Name}: {errors}");
                }
            }
        }

        return seededCount;
    }
}