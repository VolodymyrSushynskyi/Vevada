using FluentValidation;
using Vevada.Business.Orders.Commands;

namespace Vevada.Business.Orders.Validation;

public class UpdateManufacturerOrderStatusCommandValidator : AbstractValidator<UpdateManufacturerOrderStatusCommand>
{
    public UpdateManufacturerOrderStatusCommandValidator()
    {
        RuleFor(x => x.AdminId)
            .GreaterThan(0).WithMessage("Invalid Admin ID.");

        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("Invalid Order ID.");

        RuleFor(x => x.NewStatus)
            .IsInEnum().WithMessage("Invalid order status.");
    }
}
