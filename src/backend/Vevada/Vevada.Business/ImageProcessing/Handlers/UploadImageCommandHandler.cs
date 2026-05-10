using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Vevada.Business.Common;
using Vevada.Business.ImageProcessing.Commands;
using Vevada.Business.ImageProcessing.Interfaces;
using Vevada.Data;
using Vevada.Data.Entities;

namespace Vevada.Business.ImageProcessing.Handlers;

public class UploadImageCommandHandler : IRequestHandler<UploadImageCommand, HandlerResult<Guid>>
{
    private readonly VevadaDbContext _dbContext;
    private readonly IImageProcessingService _imageService;

    public UploadImageCommandHandler(VevadaDbContext dbContext, IImageProcessingService imageService)
    {
        _dbContext = dbContext;
        _imageService = imageService;
    }

    public async Task<HandlerResult<Guid>> Handle(UploadImageCommand request, CancellationToken cancellationToken)
    {
        using var md5 = MD5.Create();
        using var streamForHashing = request.File.OpenReadStream();
        var hashBytes = await md5.ComputeHashAsync(streamForHashing, cancellationToken);
        var hashString = Convert.ToHexString(hashBytes);

        var existingImage = await _dbContext.ImageAssets
            .FirstOrDefaultAsync(x => x.Hash == hashString, cancellationToken);

        if (existingImage != null)
        {
            return HandlerResult<Guid>.Success(existingImage.Id);
        }

        var newImageId = Guid.NewGuid();
        using var streamForProcessing = request.File.OpenReadStream();

        var dimensions = await _imageService.ProcessAndSaveAsync(streamForProcessing, newImageId, cancellationToken);

        var newAsset = new ImageAsset
        {
            Id = newImageId,
            Hash = hashString,
            OriginalWidth = dimensions.Width,
            OriginalHeight = dimensions.Height
        };

        _dbContext.ImageAssets.Add(newAsset);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return HandlerResult<Guid>.Success(newImageId);
    }
}
