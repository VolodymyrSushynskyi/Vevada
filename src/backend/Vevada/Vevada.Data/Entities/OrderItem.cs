using Vevada.Data.Constants;

namespace Vevada.Data.Entities;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }
    public virtual Order Order { get; set; } = null!;

    public Guid? ProductId { get; set; }
    public virtual Product? Product { get; set; }

    public string ProductName { get; set; } = string.Empty;
    public ProductSize Size { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
