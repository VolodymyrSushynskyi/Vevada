namespace Vevada.Business.ImageProcessing.Interfaces;

public interface IImageProcessingService
{
    Task<(int Width, int Height)> ProcessAndSaveAsync(Stream fileStream, Guid imageId, CancellationToken cancellationToken = default);
    void DeleteImageFile(Guid imageId);
}
