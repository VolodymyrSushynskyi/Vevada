namespace Vevada.Business.ImageProcessing.Exceptions;

public class ImageProcessingServiceException : Exception
{
    public ImageProcessingServiceException(string message)
        : base(message) { }

    public ImageProcessingServiceException(string message, Exception innerException)
        : base(message, innerException) { }
}
