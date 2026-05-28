using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vevada.Business.AdminAccounts.Commands;
using Vevada.Business.AdminAccounts.Queries;
using Vevada.Business.Common;

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

    [HttpGet]
    public async Task<IActionResult> GetAccounts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = PagedResponse<object>.DefaultPageSize,
        [FromQuery] string? role = null,
        CancellationToken cancellationToken = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 1 : pageSize > PagedResponse<object>.MaxPageSize ? PagedResponse<object>.MaxPageSize : pageSize;

        var query = new GetAdminAccountsQuery(page, pageSize, role);
        var result = await Mediator.Send(query, cancellationToken);

        return HandleResult(result);
    }
}
