using FluentValidation;
using Vevada.Business.Common;
using Vevada.Business.Products.Commands;

namespace Vevada.Business.Products.Validation;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(ValidationMessageBuilder.IsRequired("Product name"))
            .MaximumLength(150).WithMessage(ValidationMessageBuilder.MaxLength("Product name", 150));

        RuleFor(x => x.ShortDescription)
            .MaximumLength(500).WithMessage(ValidationMessageBuilder.MaxLength("Short description", 500));

        RuleFor(x => x.FullDescription)
            .MaximumLength(1500).WithMessage(ValidationMessageBuilder.MaxLength("Full description", 1500));

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage(ValidationMessageBuilder.Custom("Price must be greater than zero"));

        RuleFor(x => x.AvailableSizes)
            .NotEmpty().WithMessage(ValidationMessageBuilder.Custom("At least one size must be selected."));

        RuleFor(x => x.MainImageId)
            .NotEmpty().WithMessage(ValidationMessageBuilder.IsRequired("Main image"));

        RuleFor(x => x.NewSeriesName)
            .NotEmpty()
            .When(x => !x.ProductSeriesId.HasValue)
            .WithMessage(ValidationMessageBuilder.Custom("A new series name must be provided if an existing series is not selected"))
            .MaximumLength(150).WithMessage(ValidationMessageBuilder.MaxLength("Series name", 150));

        RuleFor(x => x.ProductSeriesId)
            .NotEmpty()
            .When(x => string.IsNullOrWhiteSpace(x.NewSeriesName))
            .WithMessage(ValidationMessageBuilder.Custom("An existing series must be selected if a new series name is not provided"));
    }
}
