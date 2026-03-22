using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Vevada.Business.Auth.Interfaces;
using Vevada.Business.Auth.Services;
using Vevada.Business.Common;

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

        return services;
    }
}
