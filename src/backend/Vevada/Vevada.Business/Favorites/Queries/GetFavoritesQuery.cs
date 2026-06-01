using MediatR;
using Vevada.Business.Common;
using Vevada.Business.Favorites.DTOs;

namespace Vevada.Business.Favorites.Queries;

public record GetFavoritesQuery(int UserId) : IRequest<HandlerResult<List<FavoriteItemDto>>>;
