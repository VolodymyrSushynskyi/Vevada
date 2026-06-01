using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.Orders.Commands;

public record RequestOrderCancellationCommand(
    int UserId,
    int OrderId
) : IRequest<HandlerResult<bool>>;
