using FluentValidation;
using Vevada.Business.Auth.Commands;
using Vevada.Business.Common;

namespace Vevada.Business.Auth.Validation;

public class LoginCommandValidator : AbstractValidator<LoginClientCommand>
{
    const string Email = "Email";
    const string Password = "Password";

    public LoginCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(ValidationMessageBuilder.IsRequired(Email))
            .EmailAddress().WithMessage(ValidationMessageBuilder.InvalidFormat(Email));

        RuleFor(x => x.Password)
            .NotEmpty()
            .MaximumLength(RegisterClientCommandValidationRules.MaxPasswordLength)
                .WithMessage(ValidationMessageBuilder.MaxLength(Password, RegisterClientCommandValidationRules.MaxPasswordLength));
    }
}
