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

public class LoginClientHandler : IRequestHandler<LoginClientCommand, HandlerResult<AuthResponseDto>>
{
    private readonly IAuthService _authService;
    private readonly ILogger<LoginClientHandler> _logger;

    public LoginClientHandler(IAuthService authService, ILogger<LoginClientHandler> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    public async Task<HandlerResult<AuthResponseDto>> Handle(LoginClientCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var permittedRoles = await _authService.GetPermittedRoles(request.Email, AppRoles.Client.Name!);

            if (!permittedRoles.Any())
            {
                _logger.LogLoginAccessDenied(request.Email);
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