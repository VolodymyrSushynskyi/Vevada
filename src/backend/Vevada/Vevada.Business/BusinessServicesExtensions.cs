using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Vevada.Business.Auth.Interfaces;
using Vevada.Business.Auth.Services;
using Vevada.Business.Common;
using Vevada.Business.ImageProcessing.Interfaces;
using Vevada.Business.ImageProcessing.Services;

namespace Vevada.Business;

public static class BusinessServicesExtensions
{
    public static IServiceCollection AddBusinessLogic(this IServiceCollection services)
    {
        // MediatR & Validation Pipeline
        services.AddValidatorsFromAssembly(typeof(AssemblyReference).Assembly);
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(AssemblyReference).Assembly);
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        // Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IImageProcessingService, ImageProcessingService>();

        return services;
    }
}
