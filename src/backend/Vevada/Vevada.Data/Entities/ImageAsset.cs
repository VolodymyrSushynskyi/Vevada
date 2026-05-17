using Vevada.Data.Entities.Base;

namespace Vevada.Data.Entities;

public class ImageAsset : IAuditableEntity
{
    public Guid Id { get; set; }
    public string Hash { get; set; } = string.Empty;
    public int OriginalWidth { get; set; }
    public int OriginalHeight { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}
