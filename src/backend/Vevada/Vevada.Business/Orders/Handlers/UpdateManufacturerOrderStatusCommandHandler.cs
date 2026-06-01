using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Orders.Commands;
using Vevada.Data;
using Vevada.Data.Constants;

namespace Vevada.Business.Orders.Handlers;

public class UpdateManufacturerOrderStatusCommandHandler : IRequestHandler<UpdateManufacturerOrderStatusCommand, HandlerResult<bool>>
{
    private readonly VevadaDbContext _context;

    public UpdateManufacturerOrderStatusCommandHandler(VevadaDbContext context)
    {
        _context = context;
    }

    public async Task<HandlerResult<bool>> Handle(UpdateManufacturerOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null)
        {
            return HandlerResult<bool>.Failure("Order not found.");
        }

        if (order.AssignedManufacturerId != request.AdminId)
        {
            return HandlerResult<bool>.Failure("You cannot update an order that is not assigned to you.");
        }

        if (order.Status == OrderStatus.Completed || order.Status == OrderStatus.Cancelled)
        {
            return HandlerResult<bool>.Failure("This order has already reached a terminal state and cannot be updated.");
        }

        if (request.NewStatus == OrderStatus.Cancelled)
        {
            order.CancellationRequested = false;
        }

        order.Status = request.NewStatus;

        await _context.SaveChangesAsync(cancellationToken);

        return HandlerResult<bool>.Success(true);
    }
}
