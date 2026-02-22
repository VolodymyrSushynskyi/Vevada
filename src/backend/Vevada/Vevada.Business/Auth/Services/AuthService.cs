using Microsoft.AspNetCore.Identity;
using Vevada.Business.Auth.DTOs;
using Vevada.Business.Auth.Exceptions;
using Vevada.Business.Auth.Interfaces;
using Vevada.Business.Auth.Models;
using Vevada.Data;
using Vevada.Data.Constants;
using Vevada.Data.Entities;

namespace Vevada.Business.Auth.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly ITokenService _tokenService;
    private readonly VevadaDbContext _context;

    public AuthService(
        UserManager<User> userManager,
        ITokenService tokenService,
        VevadaDbContext context)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _context = context;
    }

    public async Task<AuthResponseDto> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, password))
        {
            throw new AuthException("Invalid email or password");
        }

        var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
        var rawRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshTokenHash = TokenService.ComputeHash(rawRefreshToken);
        user.RefreshTokenExpiryTime = DateTimeOffset.UtcNow.AddDays(7);

        await _userManager.UpdateAsync(user);

        var roles = await _userManager.GetRolesAsync(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = rawRefreshToken,
            Email = user.Email!,
            Role = roles.FirstOrDefault() ?? AppRoles.Client.Name!,
        };
    }

    public async Task<AuthResponseDto> RegisterClientAsync(RegisterClientModel model)
    {
        var userEmail = model.Email ?? throw new AuthException(nameof(model.Email));

        var existingUser = await _userManager.FindByEmailAsync(userEmail);
        if (existingUser != null)
        {
            throw new AuthException("User with this email already exists");
        }

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var user = new User
            {
                UserName = userEmail,
                Email = userEmail,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var createResult = await _userManager.CreateAsync(user, model.Password);

            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                throw new AuthException($"User creation failed: {errors}");
            }

            var roleResult = await _userManager.AddToRoleAsync(user, AppRoles.Client.Name!);
            if (!roleResult.Succeeded)
            {
                throw new AuthException("Failed to assign client role");
            }

            var clientDetails = new ClientDetails
            {
                UserId = user.Id,
                FirstName = model.FirstName,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber
            };

            await _context.ClientDetails.AddAsync(clientDetails);
            await _context.SaveChangesAsync();

            var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
            var rawRefreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshTokenHash = TokenService.ComputeHash(rawRefreshToken);
            user.RefreshTokenExpiryTime = DateTimeOffset.UtcNow.AddDays(7);

            await _userManager.UpdateAsync(user);

            await transaction.CommitAsync();

            return new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = rawRefreshToken,
                Email = user.Email,
                Role = AppRoles.Client.Name!,
            };
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> LogoutAsync(int userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());

        if (user == null)
        {
            throw new AuthException("User not found");
        }

        user.RefreshTokenHash = null;
        user.RefreshTokenExpiryTime = null;

        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }

    public async Task<IEnumerable<string>> GetUserPermissions(string email, params string[] roles)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            throw new AuthException("User not found");
        }

        var userRoles = await _userManager.GetRolesAsync(user);

        return userRoles.Intersect(roles);
    }
}
