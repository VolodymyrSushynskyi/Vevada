using Vevada.Data.Entities.Base;

namespace Vevada.Data.Entities;

public class Cart : IAuditableEntity
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public virtual ICollection<CartItem> Items { get; set; } = new List<CartItem>();

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}
