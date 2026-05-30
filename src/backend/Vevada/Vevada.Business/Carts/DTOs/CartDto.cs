namespace Vevada.Business.Carts.DTOs;

public record CartDto(
    int CartId,
    List<CartItemDto> Items,
    decimal TotalAmount
);
