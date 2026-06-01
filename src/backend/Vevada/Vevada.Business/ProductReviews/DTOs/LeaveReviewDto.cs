namespace Vevada.Business.ProductReviews.DTOs;

public record LeaveReviewDto(
    int Rating,
    string? Comment
);
