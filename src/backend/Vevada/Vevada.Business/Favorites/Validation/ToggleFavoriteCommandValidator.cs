using FluentValidation;
using Vevada.Business.Favorites.Commands;

namespace Vevada.Business.Favorites.Validation;

public class ToggleFavoriteCommandValidator : AbstractValidator<ToggleFavoriteCommand>
{
    public ToggleFavoriteCommandValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Invalid product ID.");
    }
}
