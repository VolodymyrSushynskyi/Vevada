using MediatR;
using Vevada.Business.Carts.DTOs;
using Vevada.Business.Common;

namespace Vevada.Business.Carts.Queries;

public record GetCartQuery(int UserId) : IRequest<HandlerResult<CartDto>>;
