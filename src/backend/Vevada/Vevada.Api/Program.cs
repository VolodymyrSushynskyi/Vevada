using Serilog;
using Vevada.Business;
using Vevada.Data;

namespace Vevada.Api;

public static class Program
{
    public static async Task Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Console()
            .CreateBootstrapLogger();

        try
        {
            Log.Information("Starting Vevada API...");
            var builder = WebApplication.CreateBuilder(args);

            builder.Host.UseSerilog((context, services, configuration) => configuration
                .ReadFrom.Configuration(context.Configuration)
                .ReadFrom.Services(services)
                .Enrich.FromLogContext());

            builder.Services.AddDataInfrastructure(builder.Configuration);
            builder.Services.AddBusinessLogic();
            builder.Services.AddPresentation(builder.Configuration);

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                await app.Services.InitializeDatabaseAsync();
            }

            app.UseExceptionHandler();

            app.UseSerilogRequestLogging();

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
        catch (Exception ex)
        {
            Log.Fatal(ex, "Application terminated unexpectedly");
            Environment.ExitCode = 1;
            throw;
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }
}