using FluentValidation;
using Vevada.Business.AdminAccounts.Commands;
using Vevada.Business.Auth.Validation;
using Vevada.Business.Common;

namespace Vevada.Business.AdminAccounts.Validation;

public class CreateAdminAccountCommandValidator : AbstractValidator<CreateAdminAccountCommand>
{
    const string Email = "Email";
    const string Password = "Password";
    const string FirstName = "FirstName";
    const string LastName = "LastName";
    const string Role = "Role";

    public CreateAdminAccountCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(ValidationMessageBuilder.IsRequired(Email))
            .EmailAddress().WithMessage(ValidationMessageBuilder.InvalidFormat(Email));

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(CreateAdminAccountValidationRules.MinPasswordLength)
                .WithMessage(ValidationMessageBuilder.MinLength(Password, CreateAdminAccountValidationRules.MinPasswordLength))
            .MaximumLength(CreateAdminAccountValidationRules.MaxPasswordLength)
                .WithMessage(ValidationMessageBuilder.MaxLength(Password, CreateAdminAccountValidationRules.MaxPasswordLength))
            .Matches("[a-z]")
                .WithMessage(ValidationMessageBuilder.MustContain(Password, "a lowercase letter"))
            .Matches("[A-Z]")
                .WithMessage(ValidationMessageBuilder.MustContain(Password, "an uppercase letter"))
            .Matches("[0-9]")
                .WithMessage(ValidationMessageBuilder.MustContain(Password, "a digit"));

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password)
            .WithMessage("The password and confirmation password do not match.");

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MinimumLength(CreateAdminAccountValidationRules.MinFirstNameLength)
                .WithMessage(ValidationMessageBuilder.MinLength(FirstName, CreateAdminAccountValidationRules.MinFirstNameLength))
            .MaximumLength(CreateAdminAccountValidationRules.MaxFirstNameLength)
                .WithMessage(ValidationMessageBuilder.MaxLength(FirstName, CreateAdminAccountValidationRules.MaxFirstNameLength));

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MinimumLength(CreateAdminAccountValidationRules.MinLastNameLength)
                .WithMessage(ValidationMessageBuilder.MinLength(LastName, CreateAdminAccountValidationRules.MinLastNameLength))
            .MaximumLength(CreateAdminAccountValidationRules.MaxLastNameLength)
                .WithMessage(ValidationMessageBuilder.MaxLength(LastName, CreateAdminAccountValidationRules.MaxLastNameLength));

        RuleFor(x => x.Role)
            .NotEmpty().WithMessage(ValidationMessageBuilder.IsRequired(Role))
            .Must(role => !role.Equals(CreateAdminAccountValidationRules.ForbiddenRole, StringComparison.OrdinalIgnoreCase))
            .WithMessage("Cannot assign the SuperAdmin role to new accounts.")
            .Must(role => CreateAdminAccountValidationRules.AllowedRoles.Contains(role))
            .WithMessage("The provided role is not valid.");
    }
}
