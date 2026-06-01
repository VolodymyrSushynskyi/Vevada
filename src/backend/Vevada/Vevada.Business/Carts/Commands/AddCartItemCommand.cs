using MediatR;
using Vevada.Business.Common;
using Vevada.Data.Constants;

namespace Vevada.Business.Carts.Commands;

public record AddCartItemCommand(
    int UserId,
    Guid ProductId,
    ProductSize Size,
    int Quantity = 1
) : IRequest<HandlerResult<int>>;
