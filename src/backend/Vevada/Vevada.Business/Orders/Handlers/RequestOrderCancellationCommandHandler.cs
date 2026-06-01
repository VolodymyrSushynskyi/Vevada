using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Orders.Commands;
using Vevada.Data;
using Vevada.Data.Constants;

namespace Vevada.Business.Orders.Handlers;

public class RequestOrderCancellationCommandHandler : IRequestHandler<RequestOrderCancellationCommand, HandlerResult<bool>>
{
    private readonly VevadaDbContext _context;

    public RequestOrderCancellationCommandHandler(VevadaDbContext context)
    {
        _context = context;
    }

    public async Task<HandlerResult<bool>> Handle(RequestOrderCancellationCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o =>
                o.Id == request.OrderId &&
                o.UserId == request.UserId,
                cancellationToken);

        if (order == null)
        {
            return HandlerResult<bool>.Failure("Order not found.");
        }

        if (order.Status == OrderStatus.Shipped ||
            order.Status == OrderStatus.Completed ||
            order.Status == OrderStatus.Cancelled)
        {
            return HandlerResult<bool>.Failure("It is too late to cancel this order, or it has already been finalized.");
        }

        if (order.CancellationRequested)
        {
            return HandlerResult<bool>.Failure("Cancellation has already been requested for this order.");
        }

        order.CancellationRequested = true;

        await _context.SaveChangesAsync(cancellationToken);

        return HandlerResult<bool>.Success(true);
    }
}
