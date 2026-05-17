namespace Vevada.Business.ImageProcessing.Constants;

public static class ImageValidationMessages
{
    public const string MissingFile = "No file was uploaded.";
    public const string EmptyFile = "The uploaded file is empty.";
    public static string ExceededMaxSize(long maxSizeMb) => $"The uploaded file exceeds the maximum allowed size of {maxSizeMb} MB.";
    public static string InvalidFormat(string[] allowedFormats) => $"The uploaded file format is not supported. Allowed formats: {string.Join(", ", allowedFormats)}.";
}
