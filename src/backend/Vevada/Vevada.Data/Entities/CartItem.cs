using Vevada.Data.Constants;

namespace Vevada.Data.Entities;

public class CartItem
{
    public int Id { get; set; }

    public int CartId { get; set; }
    public virtual Cart Cart { get; set; } = null!;

    public Guid ProductId { get; set; }
    public virtual Product Product { get; set; } = null!;

    public ProductSize Size { get; set; }
    public int Quantity { get; set; }
}
