using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Orders.Commands;
using Vevada.Data;

namespace Vevada.Business.Orders.Handlers;

public class AssignManufacturerOrderCommandHandler : IRequestHandler<AssignManufacturerOrderCommand, HandlerResult<bool>>
{
    private readonly VevadaDbContext _context;

    public AssignManufacturerOrderCommandHandler(VevadaDbContext context)
    {
        _context = context;
    }

    public async Task<HandlerResult<bool>> Handle(AssignManufacturerOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null)
        {
            return HandlerResult<bool>.Failure("Order not found.");
        }

        if (order.AssignedManufacturerId != null)
        {
            return HandlerResult<bool>.Failure("This order has already been claimed by another manufacturer.");
        }

        order.AssignedManufacturerId = request.AdminId;

        await _context.SaveChangesAsync(cancellationToken);

        return HandlerResult<bool>.Success(true);
    }
}
