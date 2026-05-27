using Vevada.Data.Entities.Base;

namespace Vevada.Data.Entities;

public class ProductReview : IAuditableEntity
{
    public int Id { get; set; }

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int Rating { get; set; }
    public string? Comment { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}
