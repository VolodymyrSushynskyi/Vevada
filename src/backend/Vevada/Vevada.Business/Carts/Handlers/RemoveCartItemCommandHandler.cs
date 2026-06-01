using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Carts.Commands;
using Vevada.Business.Common;
using Vevada.Data;

namespace Vevada.Business.Carts.Handlers;

public class RemoveCartItemCommandHandler : IRequestHandler<RemoveCartItemCommand, HandlerResult<int>>
{
    private readonly VevadaDbContext _context;

    public RemoveCartItemCommandHandler(VevadaDbContext context)
    {
        _context = context;
    }

    public async Task<HandlerResult<int>> Handle(RemoveCartItemCommand request, CancellationToken cancellationToken)
    {
        var item = await _context.CartItems
            .FirstOrDefaultAsync(i =>
                i.Id == request.CartItemId &&
                i.Cart.UserId == request.UserId,
                cancellationToken);

        if (item == null)
        {
            return HandlerResult<int>.Failure("Cart item not found.");
        }

        var cartId = item.CartId;

        _context.CartItems.Remove(item);
        await _context.SaveChangesAsync(cancellationToken);

        var totalQuantity = await _context.CartItems
            .Where(i => i.CartId == cartId)
            .SumAsync(i => i.Quantity, cancellationToken);

        return HandlerResult<int>.Success(totalQuantity);
    }
}
