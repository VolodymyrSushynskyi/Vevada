using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using Vevada.Business.ImageProcessing.Interfaces;
using Vevada.Business.ImageProcessing.Models;

namespace Vevada.Business.ImageProcessing.Services;

public class ImageProcessingService : IImageProcessingService
{
    private readonly ImageSettings _settings;
    private const string ThumbSuffix = "-thumb.webp";
    private const string FullSuffix = "-full.webp";

    public ImageProcessingService(IOptions<ImageSettings> options)
    {
        _settings = options.Value;

        if (!Directory.Exists(_settings.StoragePath))
        {
            Directory.CreateDirectory(_settings.StoragePath);
        }
    }

    public async Task<(int Width, int Height)> ProcessAndSaveAsync(Stream fileStream, Guid imageId, CancellationToken cancellationToken = default)
    {
        using var image = await Image.LoadAsync(fileStream, cancellationToken);
        var originalWidth = image.Width;
        var originalHeight = image.Height;

        var thumbPath = Path.Combine(_settings.StoragePath, $"{imageId}{ThumbSuffix}");
        var fullPath = Path.Combine(_settings.StoragePath, $"{imageId}{FullSuffix}");

        var webpEncoder = new WebpEncoder { Quality = _settings.WebpQuality };

        using (var thumb = image.Clone(x => x.Resize(new ResizeOptions
        {
            Size = new Size(_settings.ThumbnailSize, _settings.ThumbnailSize),
            Mode = ResizeMode.Crop
        })))
        {
            await thumb.SaveAsync(thumbPath, webpEncoder, cancellationToken);
        }

        using (var full = image.Clone(x => x.Resize(new ResizeOptions
        {
            Size = new Size(_settings.MaxWidth, _settings.MaxHeight),
            Mode = ResizeMode.Max
        })))
        {
            await full.SaveAsync(fullPath, webpEncoder, cancellationToken);
        }

        return (originalWidth, originalHeight);
    }
}
