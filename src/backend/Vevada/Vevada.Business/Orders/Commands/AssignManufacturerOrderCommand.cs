using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.Orders.Commands;

public record AssignManufacturerOrderCommand(
    int AdminId,
    int OrderId
) : IRequest<HandlerResult<bool>>;
