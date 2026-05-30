using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Orders.DTOs;
using Vevada.Business.Orders.Queries;
using Vevada.Data;
using Vevada.Data.Constants;

namespace Vevada.Business.Orders.Handlers;

public class GetActiveOrdersQueryHandler : IRequestHandler<GetActiveOrdersQuery, HandlerResult<List<OrderDto>>>
{
    private readonly VevadaDbContext _context;

    public GetActiveOrdersQueryHandler(VevadaDbContext context)
    {
        _context = context;
    }

    public async Task<HandlerResult<List<OrderDto>>> Handle(GetActiveOrdersQuery request, CancellationToken cancellationToken)
    {
        var cutoff = DateTimeOffset.UtcNow.AddDays(-1);

        var orders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.UserId == request.UserId)
            .Where(o =>
                (o.Status != OrderStatus.Completed && o.Status != OrderStatus.Cancelled) ||
                (o.CreatedAt >= cutoff))
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto(
                o.Id,
                o.CreatedAt,
                o.Status,
                o.Items.Sum(i => i.UnitPrice * i.Quantity),
                o.Items.Sum(i => i.Quantity),
                o.Items.Select(i => new OrderItemDto(
                    i.ProductName,
                    i.Size,
                    i.UnitPrice,
                    i.Quantity,
                    i.Product != null ? i.Product.MainImage.Id : null
                )).ToList()
            ))
            .ToListAsync(cancellationToken);

        return HandlerResult<List<OrderDto>>.Success(orders);
    }
}
