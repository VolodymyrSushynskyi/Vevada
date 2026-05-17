using MediatR;
using Microsoft.AspNetCore.Http;
using Vevada.Business.Common;

namespace Vevada.Business.ImageProcessing.Commands;

public record UploadImageCommand(IFormFile File) : IRequest<HandlerResult<Guid>>;
