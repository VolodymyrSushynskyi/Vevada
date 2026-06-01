using FluentValidation;
using Vevada.Business.Orders.Commands;

namespace Vevada.Business.Orders.Validation;

public class RequestOrderCancellationCommandValidator : AbstractValidator<RequestOrderCancellationCommand>
{
    public RequestOrderCancellationCommandValidator()
    {
        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("Invalid order ID.");
    }
}
