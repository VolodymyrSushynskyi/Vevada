using Vevada.Data.Constants;

namespace Vevada.Business.Carts.DTOs;

public record CartItemDto(
    int CartItemId,
    Guid ProductId,
    string ProductName,
    ProductSize Size,
    decimal UnitPrice,
    int Quantity,
    Guid ImageId,
    bool IsAvailable
);
