using MediatR;
using Vevada.Business.Auth.Commands;
using Vevada.Business.Auth.Exceptions;
using Vevada.Business.Auth.Interfaces;
using Vevada.Business.Common;

namespace Vevada.Business.Auth.Handlers;

public class LogoutHandler : IRequestHandler<LogoutCommand, HandlerResult<bool>>
{
    private readonly IAuthService _authService;

    public LogoutHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<HandlerResult<bool>> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _authService.LogoutAsync(request.UserId);
            return HandlerResult<bool>.Success(result);
        }
        catch (AuthException ex)
        {
            return HandlerResult<bool>.Failure(ex.Message);
        }
    }
}