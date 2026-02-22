using MediatR;
using Vevada.Business.Auth.Commands;
using Vevada.Business.Auth.DTOs;
using Vevada.Business.Auth.Exceptions;
using Vevada.Business.Auth.Interfaces;
using Vevada.Business.Common;
using Vevada.Data.Constants;

namespace Vevada.Business.Auth.Handlers;

public class LoginClientHandler : IRequestHandler<LoginClientCommand, HandlerResult<AuthResponseDto>>
{
    private readonly IAuthService _authService;

    public LoginClientHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<HandlerResult<AuthResponseDto>> Handle(LoginClientCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var permittedRoles = await _authService.GetUserPermissions(request.Email, AppRoles.Client.Name!);

            if (!permittedRoles.Any())
            {
                return HandlerResult<AuthResponseDto>.Failure("Invalid email or password");
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