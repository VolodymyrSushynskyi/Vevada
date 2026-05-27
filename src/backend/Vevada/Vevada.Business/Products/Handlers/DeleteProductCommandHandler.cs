using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Products.Commands;
using Vevada.Data;

namespace Vevada.Business.Products.Handlers;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, HandlerResult<bool>>
{
    private readonly VevadaDbContext _dbContext;

    public DeleteProductCommandHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<bool>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (product == null)
        {
            return HandlerResult<bool>.Failure("Product not found.");
        }

        var seriesId = product.ProductSeriesId;

        _dbContext.Products.Remove(product);

        var remainingCount = await _dbContext.Products
            .CountAsync(p => p.ProductSeriesId == seriesId, cancellationToken);

        if (remainingCount == 1)
        {
            var series = await _dbContext.ProductSeries.FindAsync(new object[] { seriesId }, cancellationToken);
            if (series != null)
            {
                _dbContext.ProductSeries.Remove(series);
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return HandlerResult<bool>.Success(true);
    }
}
