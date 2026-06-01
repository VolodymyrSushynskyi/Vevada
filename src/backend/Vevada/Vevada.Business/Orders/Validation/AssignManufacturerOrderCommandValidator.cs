using FluentValidation;
using Vevada.Business.Orders.Commands;

namespace Vevada.Business.Orders.Validation;

public class AssignManufacturerOrderCommandValidator : AbstractValidator<AssignManufacturerOrderCommand>
{
    public AssignManufacturerOrderCommandValidator()
    {
        RuleFor(x => x.AdminId)
            .GreaterThan(0).WithMessage("Invalid Admin ID.");

        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("Invalid Order ID.");
    }
}
