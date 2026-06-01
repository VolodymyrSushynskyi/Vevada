using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Favorites.Commands;
using Vevada.Data;
using Vevada.Data.Entities;

namespace Vevada.Business.Favorites.Handlers;

public class ToggleFavoriteCommandHandler : IRequestHandler<ToggleFavoriteCommand, HandlerResult<bool>>
{
    private readonly VevadaDbContext _context;

    public ToggleFavoriteCommandHandler(VevadaDbContext context)
    {
        _context = context;
    }

    public async Task<HandlerResult<bool>> Handle(ToggleFavoriteCommand request, CancellationToken cancellationToken)
    {
        var existingFavorite = await _context.FavoriteItems.FindAsync(
            new object?[] { request.UserId, request.ProductId },
            cancellationToken);
        if (existingFavorite != null)
        {
            _context.FavoriteItems.Remove(existingFavorite);
            await _context.SaveChangesAsync(cancellationToken);

            return HandlerResult<bool>.Success(false);
        }

        var productExists = await _context.Products
            .AnyAsync(p => p.Id == request.ProductId, cancellationToken);

        if (!productExists)
        {
            return HandlerResult<bool>.Failure("Product not found.");
        }

        var newFavorite = new FavoriteItem
        {
            UserId = request.UserId,
            ProductId = request.ProductId,
        };

        _context.FavoriteItems.Add(newFavorite);
        await _context.SaveChangesAsync(cancellationToken);

        return HandlerResult<bool>.Success(true);
    }
}
