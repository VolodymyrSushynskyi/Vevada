using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Vevada.Business.Auth.Constants;
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
    private readonly ILogger<AuthService> _logger;

    const int RefreshTokenValidityDays = 7;

    public AuthService(
        UserManager<User> userManager,
        ITokenService tokenService,
        VevadaDbContext context,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _context = context;
        _logger = logger;
    }

    public async Task<AuthResponseDto> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, password))
        {
            _logger.LogLoginFailed(email, "Invalid credentials");

            throw new AuthException(AuthMessages.InvalidCredentials);
        }

        var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
        var rawRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshTokenHash = TokenService.ComputeHash(rawRefreshToken);
        user.RefreshTokenExpiryTime = DateTimeOffset.UtcNow.AddDays(RefreshTokenValidityDays);

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            var errorDescription = string.Join("; ", updateResult.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"{AuthMessages.TokenGenerationFailed}: {errorDescription}");
        }

        var roles = await _userManager.GetRolesAsync(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = rawRefreshToken,
            Email = user.Email!,
            Role = roles.FirstOrDefault() ?? AppRoles.Client.Name!, // TODO: Handle multiple roles properly if needed
        };
    }

    public async Task<AuthResponseDto> RegisterClientAsync(RegisterClientModel model)
    {
        var userEmail = model.Email ?? throw new AuthException(AuthMessages.EmailRequired);

        var existingUser = await _userManager.FindByEmailAsync(userEmail);
        if (existingUser != null)
        {
            _logger.LogRegistrationFailed(userEmail, "Email already exists in the database.");
            throw new AuthException(AuthMessages.EmailTaken);
        }

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var rawRefreshToken = _tokenService.GenerateRefreshToken();

            var user = new User
            {
                UserName = userEmail,
                Email = userEmail,
                SecurityStamp = Guid.NewGuid().ToString(),
                RefreshTokenHash = TokenService.ComputeHash(rawRefreshToken),
                RefreshTokenExpiryTime = DateTimeOffset.UtcNow.AddDays(RefreshTokenValidityDays)
            };

            var createResult = await _userManager.CreateAsync(user, model.Password);
            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                _logger.LogRegistrationFailed(userEmail, $"Identity validation failed: {errors}");
                throw new AuthException(errors);
            }

            var roleResult = await _userManager.AddToRoleAsync(user, AppRoles.Client.Name!);
            if (!roleResult.Succeeded)
            {
                _logger.LogRegistrationFailed(userEmail, "Failed to attach role to new user.");
                throw new AuthException(AuthMessages.RoleAssignmentFailed);
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
            await transaction.CommitAsync();

            var accessToken = await _tokenService.GenerateAccessTokenAsync(user);

            return new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = rawRefreshToken,
                Email = user.Email,
                Role = AppRoles.Client.Name!,
            };
        }
        catch (Exception ex)
        {
            _logger.LogRegistrationTransactionFailed(ex, userEmail);

            if (transaction.GetDbTransaction().Connection != null)
            {
                await transaction.RollbackAsync();
            }

            throw;
        }
    }

    public async Task<bool> LogoutAsync(int userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());

        if (user == null)
        {
            _logger.LogWarning("Logout attempted for non-existent UserId: {UserId}", userId);
            throw new AuthException(AuthMessages.UserNotFound);
        }

        user.RefreshTokenHash = null;
        user.RefreshTokenExpiryTime = null;

        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }

    public async Task<IEnumerable<string>> GetPermittedRoles(string email, params string[] roles)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            _logger.LogWarning("Attempted getting the roles of non-existent Email: {Email}", email);
            throw new AuthException(AuthMessages.UserNotFound);
        }

        var userRoles = await _userManager.GetRolesAsync(user);

        return userRoles.Intersect(roles);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string accessToken, string refreshToken)
    {
        var principal = await _tokenService.GetPrincipalFromExpiredTokenAsync(accessToken);
        if (principal == null)
        {
            throw new AuthException("Invalid access token or signature.");
        }

        var email = principal.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
        {
            throw new AuthException("Token does not contain email claim.");
        }

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || user.RefreshTokenHash == null || user.RefreshTokenExpiryTime <= DateTimeOffset.UtcNow)
        {
            throw new AuthException("Invalid or expired refresh token. Please log in again.");
        }

        var providedTokenHash = TokenService.ComputeHash(refreshToken);
        if (user.RefreshTokenHash != providedTokenHash)
        {
            throw new AuthException("Invalid refresh token.");
        }

        var newAccessToken = await _tokenService.GenerateAccessTokenAsync(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshTokenHash = TokenService.ComputeHash(newRefreshToken);
        user.RefreshTokenExpiryTime = DateTimeOffset.UtcNow.AddDays(RefreshTokenValidityDays);

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to save new refresh token: {errors}");
        }

        var roles = await _userManager.GetRolesAsync(user);

        return new AuthResponseDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            Email = user.Email!,
            Role = roles.FirstOrDefault() ?? AppRoles.Client.Name!
        };
    }
}
