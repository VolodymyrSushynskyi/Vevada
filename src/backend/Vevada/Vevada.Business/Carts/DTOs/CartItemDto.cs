namespace Vevada.Business.Carts.DTOs;

public record CartItemDto(
    int Id,
    Guid ProductId,
    string ProductName,
    int Size,
    int Quantity,
    decimal UnitPrice,
    Guid? MainImageId
);
