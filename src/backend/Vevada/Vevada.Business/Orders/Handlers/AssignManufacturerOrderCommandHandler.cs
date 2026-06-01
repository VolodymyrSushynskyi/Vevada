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
        var rowsAffected = await _context.Orders
            .Where(o => o.Id == request.OrderId && o.AssignedManufacturerId == null)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(o => o.AssignedManufacturerId, request.AdminId),
                cancellationToken);

        if (rowsAffected == 0)
        {
            return HandlerResult<bool>.Failure("Order not found or has already been claimed by another manufacturer.");
        }

        return HandlerResult<bool>.Success(true);
    }
}
