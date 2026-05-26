namespace Vevada.Business.Products.DTOs;

public record ProductTabCountsDto(
    int Total,
    int Published,
    int Drafts
);
