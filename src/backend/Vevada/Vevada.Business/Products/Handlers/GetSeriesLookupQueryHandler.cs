using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.Common;
using Vevada.Business.Products.DTOs;
using Vevada.Business.Products.Queries;
using Vevada.Data;

namespace Vevada.Business.Products.Handlers;

public class GetSeriesLookupQueryHandler : IRequestHandler<GetSeriesLookupQuery, HandlerResult<List<SeriesLookupDto>>>
{
    private readonly VevadaDbContext _dbContext;

    public GetSeriesLookupQueryHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<List<SeriesLookupDto>>> Handle(GetSeriesLookupQuery request, CancellationToken cancellationToken)
    {
        var series = await _dbContext.ProductSeries
            .AsNoTracking()
            .OrderBy(s => s.Name)
            .Select(s => new SeriesLookupDto(s.Id, s.Name))
            .ToListAsync(cancellationToken);

        return HandlerResult<List<SeriesLookupDto>>.Success(series);
    }
}
