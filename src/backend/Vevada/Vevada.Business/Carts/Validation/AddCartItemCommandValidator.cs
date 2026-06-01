using FluentValidation;
using Vevada.Business.Carts.Commands;

namespace Vevada.Business.Carts.Validation;

public class AddCartItemCommandValidator : AbstractValidator<AddCartItemCommand>
{
    public AddCartItemCommandValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Product ID is required.");

        RuleFor(x => x.Size)
            .IsInEnum().WithMessage("Invalid product size.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be at least 1.");
    }
}
