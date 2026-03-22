using MediatR;
using Microsoft.Extensions.Logging;
using Vevada.Business.Auth.Commands;
using Vevada.Business.Auth.Constants;
using Vevada.Business.Auth.DTOs;
using Vevada.Business.Auth.Exceptions;
using Vevada.Business.Auth.Interfaces;
using Vevada.Business.Common;
using Vevada.Data.Constants;

namespace Vevada.Business.Auth.Handlers;


public class LoginAdminHandler : IRequestHandler<LoginAdminCommand, HandlerResult<AuthResponseDto>>
{
    private readonly IAuthService _authService;
    private readonly ILogger<LoginAdminHandler> _logger;

    public LoginAdminHandler(IAuthService authService, ILogger<LoginAdminHandler> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    public async Task<HandlerResult<AuthResponseDto>> Handle(LoginAdminCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var adminRoles = new[] 
            { 
                AppRoles.Manufacturer,
                AppRoles.ProductManager,
                AppRoles.Analyst,
                AppRoles.SuperAdmin
            };
            var permittedRoles = await _authService.GetPermittedRoles(request.Email, adminRoles.Select(r => r.Name!).ToArray());

            if (!permittedRoles.Any())
            {
                _logger.LoginAccessDenied(request.Email);
                return HandlerResult<AuthResponseDto>.Failure(AuthMessages.InvalidCredentials);
            }

            var authResponse = await _authService.LoginAsync(request.Email, request.Password);

            return HandlerResult<AuthResponseDto>.Success(authResponse);
        }
        catch (AuthException ex)
        {
            return HandlerResult<AuthResponseDto>.Failure(ex.Message);
        }
    }
}