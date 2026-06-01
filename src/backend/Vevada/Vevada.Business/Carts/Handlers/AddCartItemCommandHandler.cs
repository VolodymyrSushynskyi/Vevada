using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Carts.Commands;
using Vevada.Business.Common;
using Vevada.Data;
using Vevada.Data.Constants;
using Vevada.Data.Entities;

namespace Vevada.Business.Carts.Handlers;

public class AddCartItemCommandHandler : IRequestHandler<AddCartItemCommand, HandlerResult<int>>
{
    private readonly VevadaDbContext _context;

    public AddCartItemCommandHandler(VevadaDbContext context)
    {
        _context = context;
    }

    public async Task<HandlerResult<int>> Handle(AddCartItemCommand request, CancellationToken cancellationToken)
    {
        var isProductValid = await _context.Products
            .AnyAsync(p =>
                p.Id == request.ProductId &&
                p.Status == ProductStatus.Published &&
                p.AvailableSizes.Contains(request.Size),
                cancellationToken);

        if (!isProductValid)
        {
            return HandlerResult<int>.Failure("Product not found, or it is no longer available for purchase.");
        }

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == request.UserId, cancellationToken);

        if (cart == null)
        {
            cart = new Cart { UserId = request.UserId };
            _context.Carts.Add(cart);
        }

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId && i.Size == request.Size);

        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                ProductId = request.ProductId,
                Size = request.Size,
                Quantity = request.Quantity
            });
        }

        await _context.SaveChangesAsync(cancellationToken);

        var totalQuantity = cart.Items.Sum(i => i.Quantity);

        return HandlerResult<int>.Success(totalQuantity);
    }
}
