using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.ProductReviews.Commands;
using Vevada.Data;
using Vevada.Data.Entities;

namespace Vevada.Business.ProductReviews.Handlers;

public class LeaveProductReviewCommandHandler : IRequestHandler<LeaveProductReviewCommand, HandlerResult<int>>
{
    private readonly VevadaDbContext _dbContext;

    public LeaveProductReviewCommandHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<int>> Handle(LeaveProductReviewCommand request, CancellationToken cancellationToken)
    {
        var productExists = await _dbContext.Products
            .AnyAsync(p => p.Id == request.ProductId, cancellationToken);

        if (!productExists)
        {
            return HandlerResult<int>.Failure("The specified product does not exist.");
        }

        var hasClientDetails = await _dbContext.ClientDetails
            .AnyAsync(cd => cd.UserId == request.UserId, cancellationToken);

        if (!hasClientDetails)
        {
            return HandlerResult<int>.Failure("You must complete your profile details before leaving a review.");
        }

        var existingReview = await _dbContext.ProductReviews
            .FirstOrDefaultAsync(pr => pr.ProductId == request.ProductId && pr.UserId == request.UserId, cancellationToken);

        if (existingReview != null)
        {
            existingReview.Rating = request.Rating;
            existingReview.Comment = request.Comment;

            await _dbContext.SaveChangesAsync(cancellationToken);
            return HandlerResult<int>.Success(existingReview.Id);
        }

        var newReview = new ProductReview
        {
            ProductId = request.ProductId,
            UserId = request.UserId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        _dbContext.ProductReviews.Add(newReview);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return HandlerResult<int>.Success(newReview.Id);
    }
}
