using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vevada.Business.Auth.Commands;

namespace Vevada.Api.Controllers;

public class AuthController : BaseApiController
{
    public AuthController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterClientCommand command)
    {
        return HandleResult(await Mediator.Send(command));
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginClient(LoginClientCommand command)
    {
        return HandleResult(await Mediator.Send(command));
    }

    [HttpPost("admin/login")]
    public async Task<IActionResult> LoginAdmin(LoginAdminCommand command)
    {
        return HandleResult(await Mediator.Send(command));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
        {
            return Unauthorized();
        }

        var command = new LogoutCommand(userId);
        return HandleResult(await Mediator.Send(command));
    }

    [Authorize]
    [HttpGet]
    public IActionResult TestAuthentication()
    {
        return Ok("Authenticated access successful!");
    }
}
