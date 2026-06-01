using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Carts.Commands;
using Vevada.Business.Common;
using Vevada.Data;
using Vevada.Data.Constants;

namespace Vevada.Business.Carts.Handlers;

public class UpdateCartItemQuantityCommandHandler : IRequestHandler<UpdateCartItemQuantityCommand, HandlerResult<int>>
{
    private readonly VevadaDbContext _context;

    public UpdateCartItemQuantityCommandHandler(VevadaDbContext context)
    {
        _context = context;
    }

    public async Task<HandlerResult<int>> Handle(UpdateCartItemQuantityCommand request, CancellationToken cancellationToken)
    {
        var item = await _context.CartItems
            .FirstOrDefaultAsync(i =>
                i.Id == request.CartItemId &&
                i.Cart.UserId == request.UserId &&
                i.Product.Status == ProductStatus.Published &&
                i.Product.AvailableSizes.Contains(i.Size),
                cancellationToken);

        if (item == null)
        {
            return HandlerResult<int>.Failure("Item not found, or it is no longer available for purchase.");
        }

        item.Quantity = request.Quantity;

        await _context.SaveChangesAsync(cancellationToken);

        var totalQuantity = await _context.CartItems
            .Where(i => i.CartId == item.CartId)
            .SumAsync(i => i.Quantity, cancellationToken);

        return HandlerResult<int>.Success(totalQuantity);
    }
}
