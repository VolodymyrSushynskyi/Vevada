namespace Vevada.Business.Auth.Validation;

public static class RegisterClientCommandValidationRules
{
    public const int MinPasswordLength = 8;
    public const int MaxPasswordLength = 255;

    public const int MinFirstNameLength = 2;
    public const int MaxFirstNameLength = 50;

    public const int MinLastNameLength = 3;
    public const int MaxLastNameLength = 50;

    public const int MinPhoneNumberLength = 7;
    public const int MaxPhoneNumberLength = 20;
}
