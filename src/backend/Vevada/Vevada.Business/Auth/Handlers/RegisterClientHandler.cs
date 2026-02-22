using MediatR;
using Vevada.Business.Auth.Commands;
using Vevada.Business.Auth.DTOs;
using Vevada.Business.Auth.Exceptions;
using Vevada.Business.Auth.Interfaces;
using Vevada.Business.Auth.Models;
using Vevada.Business.Common;

namespace Vevada.Business.Auth.Handlers;

public class RegisterClientHandler : IRequestHandler<RegisterClientCommand, HandlerResult<AuthResponseDto>>
{
    private readonly IAuthService _authService;

    public RegisterClientHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<HandlerResult<AuthResponseDto>> Handle(RegisterClientCommand request, CancellationToken cancellationToken)
    {
        var registerModel = new RegisterClientModel
        {
            Email = request.Email,
            Password = request.Password,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber
        };

        try
        {
            var authResponse = await _authService.RegisterClientAsync(registerModel);
            return HandlerResult<AuthResponseDto>.Success(authResponse);
        }
        catch (AuthException ex)
        {
            return HandlerResult<AuthResponseDto>.Failure(ex.Message);
        }
    }
}