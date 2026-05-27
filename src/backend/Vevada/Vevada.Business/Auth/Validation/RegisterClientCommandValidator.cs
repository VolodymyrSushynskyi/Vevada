using FluentValidation;
using Vevada.Business.Auth.Commands;
using Vevada.Business.Common;

namespace Vevada.Business.Auth.Validation;

public class RegisterClientCommandValidator : AbstractValidator<RegisterClientCommand>
{
    public RegisterClientCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(ValidationMessageBuilder.IsRequired("Email"))
            .EmailAddress().WithMessage(ValidationMessageBuilder.InvalidFormat("Email"));

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(RegisterClientCommandValidationRules.MinPasswordLength)
                .WithMessage(ValidationMessageBuilder.MinLength("Password", RegisterClientCommandValidationRules.MinPasswordLength))
            .MaximumLength(RegisterClientCommandValidationRules.MaxPasswordLength)
                .WithMessage(ValidationMessageBuilder.MaxLength("Password", RegisterClientCommandValidationRules.MaxPasswordLength))
            .Matches("[a-z]")
                .WithMessage(ValidationMessageBuilder.MustContain("Password", "a lowercase letter"))
            .Matches("[A-Z]")
                .WithMessage(ValidationMessageBuilder.MustContain("Password", "an uppercase letter"))
            .Matches("[0-9]")
                .WithMessage(ValidationMessageBuilder.MustContain("Password", "a digit"));

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MinimumLength(RegisterClientCommandValidationRules.MinFirstNameLength)
                .WithMessage(ValidationMessageBuilder.MinLength("FirstName", RegisterClientCommandValidationRules.MinFirstNameLength))
            .MaximumLength(RegisterClientCommandValidationRules.MaxFirstNameLength)
                .WithMessage(ValidationMessageBuilder.MaxLength("FirstName", RegisterClientCommandValidationRules.MaxFirstNameLength));

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MinimumLength(RegisterClientCommandValidationRules.MinLastNameLength)
                .WithMessage(ValidationMessageBuilder.MinLength("LastName", RegisterClientCommandValidationRules.MinLastNameLength))
            .MaximumLength(RegisterClientCommandValidationRules.MaxLastNameLength)
                .WithMessage(ValidationMessageBuilder.MaxLength("LastName", RegisterClientCommandValidationRules.MaxLastNameLength));

        RuleFor(x => x.PhoneNumber)
             .NotEmpty()
             .MinimumLength(RegisterClientCommandValidationRules.MinPhoneNumberLength)
                 .WithMessage(ValidationMessageBuilder.MinLength("PhoneNumber", RegisterClientCommandValidationRules.MinPhoneNumberLength))
             .MaximumLength(RegisterClientCommandValidationRules.MaxPhoneNumberLength)
                 .WithMessage(ValidationMessageBuilder.MaxLength("PhoneNumber", RegisterClientCommandValidationRules.MaxPhoneNumberLength));
    }
}
