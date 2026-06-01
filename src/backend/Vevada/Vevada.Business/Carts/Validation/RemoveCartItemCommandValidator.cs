using FluentValidation;
using Vevada.Business.Carts.Commands;

namespace Vevada.Business.Carts.Validation;

public class RemoveCartItemCommandValidator : AbstractValidator<RemoveCartItemCommand>
{
    public RemoveCartItemCommandValidator()
    {
        RuleFor(x => x.CartItemId)
            .GreaterThan(0).WithMessage("Invalid cart item ID.");
    }
}
