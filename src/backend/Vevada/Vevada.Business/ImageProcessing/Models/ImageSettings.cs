namespace Vevada.Business.ImageProcessing.Models;

public class ImageSettings
{
    public const string SectionName = "ImageSettings";

    public required string StoragePath { get; set; }
    public required string RequestPath { get; set; }
    public required int ThumbnailSize { get; set; }
    public required int MaxWidth { get; set; }
    public required int MaxHeight { get; set; }
    public required int WebpQuality { get; set; }
    public required int MaxFileSizeMb { get; set; }
    public required string[] AllowedContentTypes { get; set; }
    public required int OrphanedImageCutoffHours { get; set; }
}
