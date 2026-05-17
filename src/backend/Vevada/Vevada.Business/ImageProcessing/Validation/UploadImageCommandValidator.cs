using FluentValidation;
using Microsoft.Extensions.Options;
using Vevada.Business.ImageProcessing.Commands;
using Vevada.Business.ImageProcessing.Constants;
using Vevada.Business.ImageProcessing.Models;

namespace Vevada.Business.ImageProcessing.Validation;

public class UploadImageCommandValidator : AbstractValidator<UploadImageCommand>
{
    public UploadImageCommandValidator(IOptions<ImageSettings> options)
    {
        var settings = options.Value;

        var maxFileSizeBytes = settings.MaxFileSizeMb * 1024 * 1024;

        RuleFor(x => x.File)
            .NotNull()
            .WithMessage(ImageValidationMessages.MissingFile)
            .DependentRules(() =>
            {
                RuleFor(x => x.File.Length)
                    .GreaterThan(0).WithMessage(ImageValidationMessages.EmptyFile)
                    .LessThanOrEqualTo(maxFileSizeBytes)
                    .WithMessage(ImageValidationMessages.ExceededMaxSize(settings.MaxFileSizeMb));
                RuleFor(x => x.File.ContentType)
                    .Must(contentType => settings.AllowedContentTypes.Contains(contentType.ToLowerInvariant()))
                    .WithMessage(ImageValidationMessages.InvalidFormat(settings.AllowedContentTypes));
            });
    }
}
