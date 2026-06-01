using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.Carts.Commands;

public record RemoveCartItemCommand(
    int UserId,
    int CartItemId
) : IRequest<HandlerResult<int>>;
