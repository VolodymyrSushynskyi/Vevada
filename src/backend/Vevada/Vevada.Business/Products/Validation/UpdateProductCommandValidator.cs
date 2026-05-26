using FluentValidation;
using Vevada.Business.Common;
using Vevada.Business.Products.Commands;

namespace Vevada.Business.Products.Validation;

public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage(ValidationMessageBuilder.IsRequired("Product ID"));

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(ValidationMessageBuilder.IsRequired("Product name"))
            .MaximumLength(ProductValidationRules.MaxNameLength)
            .WithMessage(ValidationMessageBuilder.MaxLength("Product name", ProductValidationRules.MaxNameLength));

        RuleFor(x => x.ShortDescription)
            .MaximumLength(ProductValidationRules.MaxShortDescriptionLength)
            .WithMessage(ValidationMessageBuilder.MaxLength("Short description", ProductValidationRules.MaxShortDescriptionLength));

        RuleFor(x => x.FullDescription)
            .MaximumLength(ProductValidationRules.MaxFullDescriptionLength)
            .WithMessage(ValidationMessageBuilder.MaxLength("Full description", ProductValidationRules.MaxFullDescriptionLength));

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage(ValidationMessageBuilder.Custom("Price must be greater than zero."));

        RuleFor(x => x.AvailableSizes)
            .NotEmpty().WithMessage(ValidationMessageBuilder.Custom("At least one size must be selected."));

        RuleFor(x => x.MainImageId)
            .NotEmpty().WithMessage(ValidationMessageBuilder.IsRequired("Main image"));

        RuleFor(x => x.NewSeriesName)
            .NotEmpty()
            .When(x => !x.ProductSeriesId.HasValue)
            .WithMessage(ValidationMessageBuilder.Custom("A new series name must be provided if an existing series is not selected."))
            .MaximumLength(ProductValidationRules.MaxSeriesNameLength)
            .WithMessage(ValidationMessageBuilder.MaxLength("Series name", ProductValidationRules.MaxSeriesNameLength));

        RuleFor(x => x.ProductSeriesId)
            .NotEmpty()
            .When(x => string.IsNullOrWhiteSpace(x.NewSeriesName))
            .WithMessage(ValidationMessageBuilder.Custom("An existing series must be selected if a new series name is not provided."));

        RuleFor(x => x)
            .Must(x =>
            {
                var hasProductSeriesId = x.ProductSeriesId.HasValue;
                var hasNewSeriesName = !string.IsNullOrWhiteSpace(x.NewSeriesName);
                return hasProductSeriesId != hasNewSeriesName;
            })
            .WithName("ProductSeries")
            .WithMessage(ValidationMessageBuilder.Custom("Provide either an existing series ID or a new series name, but not both."));
    }
}
