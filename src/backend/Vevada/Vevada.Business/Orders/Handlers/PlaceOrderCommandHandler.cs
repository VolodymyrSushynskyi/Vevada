using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Orders.Commands;
using Vevada.Data;
using Vevada.Data.Constants;
using Vevada.Data.Entities;

namespace Vevada.Business.Orders.Handlers;

public class PlaceOrderCommandHandler : IRequestHandler<PlaceOrderCommand, HandlerResult<int>>
{
    private readonly VevadaDbContext _context;

    public PlaceOrderCommandHandler(VevadaDbContext context)
    {
        _context = context;
    }

    public async Task<HandlerResult<int>> Handle(PlaceOrderCommand request, CancellationToken cancellationToken)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == request.UserId, cancellationToken);

        if (cart == null || !cart.Items.Any())
        {
            return HandlerResult<int>.Failure("Your cart is empty.");
        }

        var hasStaleItems = cart.Items.Any(i =>
            i.Product.Status != ProductStatus.Published ||
            !i.Product.AvailableSizes.Contains(i.Size));

        if (hasStaleItems)
        {
            return HandlerResult<int>.Failure("Some items in your cart are no longer available. Please review your cart before placing the order.");
        }

        var order = new Order
        {
            UserId = request.UserId,
            Status = OrderStatus.Pending,
            Items = new List<OrderItem>()
        };

        foreach (var cartItem in cart.Items)
        {
            order.Items.Add(new OrderItem
            {
                ProductId = cartItem.ProductId,
                ProductName = cartItem.Product.Name,
                UnitPrice = cartItem.Product.Price,
                Size = cartItem.Size,
                Quantity = cartItem.Quantity
            });
        }

        _context.Orders.Add(order);
        _context.CartItems.RemoveRange(cart.Items);

        await _context.SaveChangesAsync(cancellationToken);

        return HandlerResult<int>.Success(order.Id);
    }
}
