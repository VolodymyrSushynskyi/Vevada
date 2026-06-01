using MediatR;
using Vevada.Business.Common;
using Vevada.Data.Constants;

namespace Vevada.Business.Orders.Commands;

public record UpdateManufacturerOrderStatusCommand(
    int AdminId,
    int OrderId,
    OrderStatus NewStatus
) : IRequest<HandlerResult<bool>>;
