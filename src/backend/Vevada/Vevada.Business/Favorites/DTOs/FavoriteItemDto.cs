namespace Vevada.Business.Favorites.DTOs;

public record FavoriteItemDto(
    Guid ProductId,
    string ProductName,
    decimal Price,
    Guid MainImageId,
    bool IsAvailable
);
