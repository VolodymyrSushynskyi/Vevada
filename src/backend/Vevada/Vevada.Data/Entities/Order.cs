using Vevada.Data.Constants;
using Vevada.Data.Entities.Base;

namespace Vevada.Data.Entities;

public class Order : IAuditableEntity
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public OrderStatus Status { get; set; }
    public bool CancellationRequested { get; set; } = false;

    public int? AssignedManufacturerId { get; set; }
    public virtual User? AssignedManufacturer { get; set; }

    public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}
