using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.Products.Commands;

public record DeleteProductCommand(Guid Id) : IRequest<HandlerResult<bool>>;
