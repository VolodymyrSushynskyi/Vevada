using Vevada.Data.Constants;

namespace Vevada.Business.Orders.DTOs;

public record UpdateManufacturerOrderStatusRequest(OrderStatus NewStatus);
