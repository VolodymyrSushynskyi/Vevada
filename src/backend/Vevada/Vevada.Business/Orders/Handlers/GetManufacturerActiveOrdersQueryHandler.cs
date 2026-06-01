using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Orders.DTOs;
using Vevada.Business.Orders.Queries;
using Vevada.Data;
using Vevada.Data.Constants;

namespace Vevada.Business.Orders.Handlers;

public class GetManufacturerActiveOrdersQueryHandler : IRequestHandler<GetManufacturerActiveOrdersQuery, HandlerResult<List<OrderDto>>>
{
    private readonly VevadaDbContext _context;

    public GetManufacturerActiveOrdersQueryHandler(VevadaDbContext context)
    {
        _context = context;
    }

    public async Task<HandlerResult<List<OrderDto>>> Handle(GetManufacturerActiveOrdersQuery request, CancellationToken cancellationToken)
    {
        var orders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.AssignedManufacturerId == request.AdminId)
            .Where(o => o.Status != OrderStatus.Completed && o.Status != OrderStatus.Cancelled)
            .OrderBy(o => o.CreatedAt)
            .Select(o => new OrderDto(
                o.Id,
                o.CreatedAt,
                o.Status,
                o.Items.Sum(i => i.UnitPrice * i.Quantity),
                o.Items.Sum(i => i.Quantity),
                o.CancellationRequested,
                o.Items.Select(i => new OrderItemDto(
                    i.ProductName,
                    i.Size,
                    i.UnitPrice,
                    i.Quantity,
                    i.Product != null ? i.Product.MainImageId : null
                )).ToList()
            ))
            .ToListAsync(cancellationToken);

        return HandlerResult<List<OrderDto>>.Success(orders);
    }
}
