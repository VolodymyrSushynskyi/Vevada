using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vevada.Business.Common;
using Vevada.Data.Constants;

namespace Vevada.Business.Carts.Commands;

public record AddCartItemCommand(
    int UserId,
    Guid ProductId,
    ProductSize Size,
    int Quantity = 1
) : IRequest<HandlerResult<int>>;
