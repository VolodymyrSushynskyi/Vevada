using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using Vevada.Business.ImageProcessing.Constants;
using Vevada.Business.ImageProcessing.Exceptions;
using Vevada.Business.ImageProcessing.Interfaces;
using Vevada.Business.ImageProcessing.Models;

namespace Vevada.Business.ImageProcessing.Services;

public class ImageProcessingService : IImageProcessingService
{
    private readonly ImageSettings _settings;
    private readonly ILogger<ImageProcessingService> _logger;

    private const string ThumbSuffix = "-thumb.webp";
    private const string FullSuffix = "-full.webp";

    private const int MaxPixelWidth = 4096;
    private const int MaxPixelHeight = 4096;

    public ImageProcessingService(IOptions<ImageSettings> options, ILogger<ImageProcessingService> logger)
    {
        _settings = options.Value;
        _logger = logger;

        if (!Directory.Exists(_settings.StoragePath))
        {
            Directory.CreateDirectory(_settings.StoragePath);
        }
    }

    public async Task<(int Width, int Height)> ProcessAndSaveAsync(Stream fileStream, Guid imageId, CancellationToken cancellationToken = default)
    {
        try
        {
            if (!await ValidateImagePixelSize(fileStream, cancellationToken))
            {
                _logger.LogWarning(ImageProcessingServiceMessages.ImageProcessingError);
                throw new ImageProcessingServiceException(ImageProcessingServiceMessages.ImageProcessingError);
            }

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
        catch (Exception ex) when (
            ex is NotSupportedException ||
            ex is InvalidImageContentException ||
            ex is UnknownImageFormatException ||
            ex is ImageProcessingException)
        {
            _logger.LogError(ex, ImageProcessingServiceMessages.ImageProcessingError);
            throw new ImageProcessingServiceException(ImageProcessingServiceMessages.ImageProcessingError, ex);
        }
    }

    public void DeleteImageFile(Guid imageId)
    {
        var thumbPath = Path.Combine(_settings.StoragePath, $"{imageId}{ThumbSuffix}");
        var fullPath = Path.Combine(_settings.StoragePath, $"{imageId}{FullSuffix}");

        DeleteFile(thumbPath);
        DeleteFile(fullPath);
    }

    private void DeleteFile(string filePath)
    {
        try
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, ImageProcessingServiceMessages.ImageDeletionError);
            throw new ImageProcessingServiceException(ImageProcessingServiceMessages.ImageDeletionError, ex);
        }
    }

    private async Task<bool> ValidateImagePixelSize(Stream fileStream, CancellationToken cancellationToken)
    {
        var imageInfo = await Image.IdentifyAsync(fileStream, cancellationToken);
        fileStream.Position = 0;
        return imageInfo.Width <= MaxPixelWidth && imageInfo.Height <= MaxPixelHeight;
    }
}
