using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.ProductReviews.Commands;
using Vevada.Data;

namespace Vevada.Business.ProductReviews.Handlers;

public class DeleteProductReviewCommandHandler : IRequestHandler<DeleteProductReviewCommand, HandlerResult<bool>>
{
    private readonly VevadaDbContext _dbContext;

    public DeleteProductReviewCommandHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<bool>> Handle(DeleteProductReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _dbContext.ProductReviews
            .FirstOrDefaultAsync(pr => pr.ProductId == request.ProductId && pr.UserId == request.UserId, cancellationToken);

        if (review == null)
        {
            return HandlerResult<bool>.Failure("Review not found.");
        }

        _dbContext.ProductReviews.Remove(review);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return HandlerResult<bool>.Success(true);
    }
}
