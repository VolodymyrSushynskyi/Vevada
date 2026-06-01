using Vevada.Data.Constants;

namespace Vevada.Business.Orders.DTOs;

public record OrderItemDto(
    string ProductName,
    ProductSize Size,
    decimal UnitPrice,
    int Quantity,
    Guid? ImageId
);
