using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.Carts.Commands;

public record UpdateCartItemQuantityCommand(
    int UserId,
    int CartItemId,
    int Quantity
) : IRequest<HandlerResult<int>>;
