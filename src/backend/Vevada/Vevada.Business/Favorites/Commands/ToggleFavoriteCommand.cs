using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.Favorites.Commands;

public record ToggleFavoriteCommand(
    int UserId,
    Guid ProductId
) : IRequest<HandlerResult<bool>>;
