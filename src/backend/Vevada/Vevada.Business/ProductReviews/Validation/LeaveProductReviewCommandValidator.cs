using FluentValidation;
using Vevada.Business.Common;
using Vevada.Business.ProductReviews.Commands;

namespace Vevada.Business.ProductReviews.Validation;

public class LeaveProductReviewCommandValidator : AbstractValidator<LeaveProductReviewCommand>
{
    public LeaveProductReviewCommandValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage(ValidationMessageBuilder.IsRequired("Product ID"));

        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage(ValidationMessageBuilder.Custom("Invalid User ID."));

        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5)
            .WithMessage(ValidationMessageBuilder.Custom("Rating must be exactly between 1 and 5."));

        RuleFor(x => x.Comment)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrWhiteSpace(x.Comment))
            .WithMessage(ValidationMessageBuilder.MaxLength("Review comment", 1000));
    }
}
