using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Vevada.Business.ImageProcessing.Interfaces;
using Vevada.Business.ImageProcessing.Models;
using Vevada.Data;

namespace Vevada.Business.ImageProcessing.Services;

public class OrphanedImageCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ImageSettings _settings;
    private readonly ILogger<OrphanedImageCleanupService> _logger;

    public OrphanedImageCleanupService(
        IServiceProvider serviceProvider,
        IOptions<ImageSettings> options,
        ILogger<OrphanedImageCleanupService> logger)
    {
        _serviceProvider = serviceProvider;
        _settings = options.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Orphaned Image Cleanup Service is starting...");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var now = DateTime.Now;
                var targetTime = new TimeOnly(3, 0); // 3:00 AM

                var nextRun = DateTime.Today.Add(targetTime.ToTimeSpan());

                if (now > nextRun)
                {
                    nextRun = nextRun.AddDays(1);
                }

                var delay = nextRun - now;
                _logger.LogInformation("Next cleanup scheduled to run in {Hours}h {Minutes}m.", delay.Hours, delay.Minutes);

                await Task.Delay(delay, stoppingToken);

                if (!stoppingToken.IsCancellationRequested)
                {
                    await PerformFullCleanupCycleAsync(stoppingToken);
                }
            }
            catch (TaskCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "A fatal error occurred during the image cleanup cycle.");

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }

    private async Task PerformFullCleanupCycleAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting cleanup cycle.");

        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<VevadaDbContext>();
        var imageService = scope.ServiceProvider.GetRequiredService<IImageProcessingService>();

        await CleanupOrphanedFilesAsync(dbContext, cancellationToken);

        await CleanupAbandonedRecordsAsync(dbContext, imageService, cancellationToken);

        _logger.LogInformation("Cleanup cycle complete.");
    }

    private async Task CleanupOrphanedFilesAsync(VevadaDbContext dbContext, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Scanning for orphaned physical files...");

        if (!Directory.Exists(_settings.StoragePath))
        { 
            return;
        }

        var cutoffTime = DateTime.UtcNow.AddHours(-_settings.OrphanedImageCutoffHours);
        var files = Directory.GetFiles(_settings.StoragePath, "*.webp")
            .Select(path => new FileInfo(path))
            .Where(f => f.CreationTimeUtc < cutoffTime)
            .ToList();

        if (!files.Any())
        { 
            return;
        }

        var fileGuids = files
            .Where(f => f.Name.Length >= 36)
            .Select(f => f.Name.Substring(0, 36))
            .Distinct()
            .ToList();

        var validGuidsInDb = await dbContext.ImageAssets
            .Where(x => fileGuids.Contains(x.Id.ToString()))
            .Select(x => x.Id.ToString())
            .ToListAsync(cancellationToken);

        var orphanedFiles = files.Where(f => !validGuidsInDb.Contains(f.Name.Substring(0, 36))).ToList();

        foreach (var file in orphanedFiles)
        {
            try
            {
                file.Delete();
                _logger.LogInformation("Deleted orphaned file: {FileName}", file.Name);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete file: {FileName}", file.Name);
            }
        }
    }

    private async Task CleanupAbandonedRecordsAsync(
        VevadaDbContext dbContext,
        IImageProcessingService imageService,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Scanning for abandoned records...");

        var cutoffTime = DateTime.UtcNow.AddHours(-_settings.OrphanedImageCutoffHours);

        var oldImages = dbContext.ImageAssets
            .Where(img => img.CreatedAt < cutoffTime)
            .AsAsyncEnumerable();

        int deletedCount = 0;

        await foreach (var image in oldImages.WithCancellation(cancellationToken))
        {
            try
            {
                dbContext.ImageAssets.Remove(image);

                await dbContext.SaveChangesAsync(cancellationToken);

                imageService.DeleteImageFile(image.Id);
                deletedCount++;

                _logger.LogInformation("Deleted abandoned record and its files for Image: {ImageId}", image.Id);
            }
            catch (DbUpdateException)
            {
                dbContext.Entry(image).State = EntityState.Unchanged;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to process database cleanup for Image: {ImageId}", image.Id);
                dbContext.Entry(image).State = EntityState.Unchanged;
            }
        }

        _logger.LogInformation("Database cleanup complete. Removed {Count} abandoned records.", deletedCount);
    }
}
