using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Favorites.DTOs;
using Vevada.Business.Favorites.Queries;
using Vevada.Data;
using Vevada.Data.Constants;

namespace Vevada.Business.Favorites.Handlers;

public class GetFavoritesQueryHandler : IRequestHandler<GetFavoritesQuery, HandlerResult<List<FavoriteItemDto>>>
{
    private readonly VevadaDbContext _context;

    public GetFavoritesQueryHandler(VevadaDbContext context)
    {
        _context = context;
    }

    public async Task<HandlerResult<List<FavoriteItemDto>>> Handle(GetFavoritesQuery request, CancellationToken cancellationToken)
    {
        var favorites = await _context.FavoriteItems
            .AsNoTracking()
            .Where(f => f.UserId == request.UserId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new FavoriteItemDto(
                f.ProductId,
                f.Product.Name,
                f.Product.Price,
                f.Product.MainImageId,
                f.Product.Status == ProductStatus.Published
            ))
            .ToListAsync(cancellationToken);

        return HandlerResult<List<FavoriteItemDto>>.Success(favorites);
    }
}
