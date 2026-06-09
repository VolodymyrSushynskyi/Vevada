namespace Vevada.Business.ProductReviews.DTOs;

public record UserReviewDto(
    int Id,
    Guid ProductId,
    string ProductName,
    Guid ProductMainImageId,
    int Rating,
    string? Comment,
    DateTimeOffset CreatedAt
);
