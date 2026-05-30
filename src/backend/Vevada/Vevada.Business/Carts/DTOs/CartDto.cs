namespace Vevada.Business.Carts.DTOs;

public record CartDto(
    int TotalItems,
    decimal Subtotal,
    List<CartItemDto> Items
);
