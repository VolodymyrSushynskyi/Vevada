namespace Vevada.Business.ProductReviews.DTOs;

public record ProductReviewDto(
    int Id,
    int UserId,
    string CustomerName,
    int Rating,
    string? Comment,
    DateTimeOffset CreatedAt
);
