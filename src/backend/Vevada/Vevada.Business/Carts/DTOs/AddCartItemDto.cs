using Vevada.Data.Constants;

namespace Vevada.Business.Carts.DTOs;

public record AddCartItemDto(Guid ProductId, ProductSize Size, int Quantity = 1);
