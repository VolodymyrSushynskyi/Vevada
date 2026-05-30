using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Carts.DTOs;
using Vevada.Business.Carts.Queries;
using Vevada.Business.Common;
using Vevada.Data;

namespace Vevada.Business.Carts.Handlers;

public class GetCartQueryHandler : IRequestHandler<GetCartQuery, HandlerResult<CartDto>>
{
    private readonly VevadaDbContext _context;

    public GetCartQueryHandler(VevadaDbContext context)
    {
        _context = context;
    }

    public async Task<HandlerResult<CartDto>> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        var cart = await _context.Carts
            .AsNoTracking()
            .Include(c => c.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == request.UserId, cancellationToken);

        if (cart == null || !cart.Items.Any())
        {
            return HandlerResult<CartDto>.Success(new CartDto(0, 0m, new List<CartItemDto>()));
        }

        var items = cart.Items.Select(i => new CartItemDto(
            i.Id,
            i.ProductId,
            i.Product.Name,
            i.Size,
            i.Quantity,
            i.Product.Price,
            i.Product.MainImageId
        )).ToList();

        var totalItems = items.Sum(i => i.Quantity);
        var subtotal = items.Sum(i => i.Quantity * i.UnitPrice);

        var dto = new CartDto(totalItems, subtotal, items);

        return HandlerResult<CartDto>.Success(dto);
    }
}
