using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vevada.Business.AdminAccounts.Commands;

namespace Vevada.Api.Controllers;

[Route("api/admin/accounts")]
[Authorize(Roles = "SuperAdmin")]
public class AdminAccountsController : BaseApiController
{
    public AdminAccountsController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAdminAccountCommand command, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(command, cancellationToken);
        return HandleResult(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAccount(int id, CancellationToken cancellationToken)
    {
        var command = new DeleteAdminAccountCommand(id);
        var result = await Mediator.Send(command, cancellationToken);
        return HandleResult(result);
    }
}
