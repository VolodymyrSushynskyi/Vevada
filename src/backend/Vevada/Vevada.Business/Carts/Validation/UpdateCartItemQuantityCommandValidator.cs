using FluentValidation;
using Vevada.Business.Carts.Commands;

namespace Vevada.Business.Carts.Validation;

public class UpdateCartItemQuantityCommandValidator : AbstractValidator<UpdateCartItemQuantityCommand>
{
    public UpdateCartItemQuantityCommandValidator()
    {
        RuleFor(x => x.CartItemId)
            .GreaterThan(0).WithMessage("Invalid cart item ID.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be at least 1. To remove an item, use the delete action.");
    }
}
