
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Vevada.Business;
using Vevada.Data;
using Vevada.Data.Entities;

namespace Vevada.Api;

public static class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddDbContext(builder.Configuration);
        builder.Services.AddIdentityCore<User>()
            .AddRoles<Role>()
            .AddEntityFrameworkStores<VevadaDbContext>();
        builder.Services.AddSeeders();

        builder.Services.ConfigurePipeline();
        builder.Services.AddServices();

        builder.Services.AddAuth(builder.Configuration);
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c => {
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Enter your JWT token"
            });
        });


        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            using (var scope = app.Services.CreateScope())
            {
                await DataServicesExtensions.MigrateDatabaseAsync(scope);
                await DataServicesExtensions.SeedDatabaseAsync(scope);
            }
        }

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();


        app.MapControllers();

        await app.RunAsync();
    }
}
