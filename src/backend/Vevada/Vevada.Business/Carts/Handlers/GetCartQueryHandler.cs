using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Carts.DTOs;
using Vevada.Business.Carts.Queries;
using Vevada.Business.Common;
using Vevada.Data;
using Vevada.Data.Constants;

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
            .Where(c => c.UserId == request.UserId)
            .Select(c => new CartDto(
                c.Id,
                c.Items.Select(i => new CartItemDto(
                    i.Id,
                    i.ProductId,
                    i.Product.Name,
                    i.Size,
                    i.Product.Price,
                    i.Quantity,
                    i.Product.MainImageId,
                    i.Product.Status == ProductStatus.Published && i.Product.AvailableSizes.Contains(i.Size)
                )).ToList(),
                c.Items
                    .Where(i => i.Product.Status == ProductStatus.Published && i.Product.AvailableSizes.Contains(i.Size))
                    .Sum(i => i.Product.Price * i.Quantity)
            ))
            .FirstOrDefaultAsync(cancellationToken);

        if (cart == null)
        {
            return HandlerResult<CartDto>.Success(new CartDto(0, new List<CartItemDto>(), 0m));
        }

        return HandlerResult<CartDto>.Success(cart);
    }
}
