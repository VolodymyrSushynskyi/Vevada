
namespace Vevada.Business.Common;

public static class ValidationMessageBuilder
{
    public static string IsRequired(string fieldName)
    {
        return $"{fieldName} is required";
    }

    public static string MinLength(string fieldName, int minLength)
    {
        return $"{fieldName} must be at least {minLength} characters long";
    }

    public static string MaxLength(string fieldName, int maxLength)
    {
        return $"{fieldName} must be at most {maxLength} characters long";
    }

    public static string Range(string fieldName, int min, int max)
    {
        return $"{fieldName} must be between {min} and {max}";
    }

    public static string InvalidFormat(string fieldName)
    {
        return $"{fieldName} has an invalid format";
    }

    public static string MustContain(string fieldName, string requirement)
    {
        return $"{fieldName} must contain {requirement}";
    }

    public static string MustNotContain(string fieldName, string requirement)
    {
        return $"{fieldName} must not contain {requirement}";
    }

    public static string Custom(string message)
    {
        return message;
    }
}
