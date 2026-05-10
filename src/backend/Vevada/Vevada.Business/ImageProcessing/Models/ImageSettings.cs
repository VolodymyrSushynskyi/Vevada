namespace Vevada.Business.ImageProcessing.Models;

public class ImageSettings
{
    public const string SectionName = "ImageSettings";

    public string StoragePath { get; set; } = "Storage/Images";
    public string RequestPath { get; set; } = "/content/images";
    public int ThumbnailSize { get; set; } = 400;
    public int MaxWidth { get; set; } = 1920;
    public int MaxHeight { get; set; } = 1080;
    public int WebpQuality { get; set; } = 80;
    public int MaxFileSizeMb { get; set; } = 5;
    public string[] AllowedContentTypes { get; set; } = { "image/jpeg", "image/png", "image/webp" };
    public int OrphanedImageCutoffHours { get; set; } = 24;
}
