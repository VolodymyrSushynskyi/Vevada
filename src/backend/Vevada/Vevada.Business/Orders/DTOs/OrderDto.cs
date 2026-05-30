using Vevada.Data.Constants;

namespace Vevada.Business.Orders.DTOs;

public record OrderDto(
    int OrderId,
    DateTimeOffset CreatedAt,
    OrderStatus Status,
    decimal TotalAmount,
    int TotalItems,
    List<OrderItemDto> Items
);
