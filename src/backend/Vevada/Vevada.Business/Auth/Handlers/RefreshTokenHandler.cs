using MediatR;
using Vevada.Business.Auth.Commands;
using Vevada.Business.Auth.DTOs;
using Vevada.Business.Auth.Exceptions;
using Vevada.Business.Auth.Interfaces;
using Vevada.Business.Common;

namespace Vevada.Business.Auth.Handlers;

public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, HandlerResult<AuthResponseDto>>
{
    private readonly IAuthService _authService;

    public RefreshTokenHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<HandlerResult<AuthResponseDto>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var authResponse = await _authService.RefreshTokenAsync(request.AccessToken, request.RefreshToken);

            return HandlerResult<AuthResponseDto>.Success(authResponse);
        }
        catch (AuthException ex)
        {
            return HandlerResult<AuthResponseDto>.Failure(ex.Message);
        }
    }
}
