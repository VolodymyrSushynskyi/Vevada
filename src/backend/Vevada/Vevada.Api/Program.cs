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

            var runMigrations = app.Configuration.GetValue<bool>("RUN_MIGRATIONS_ON_STARTUP");

            if (runMigrations)
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
            app.UseImageStaticFiles();
            app.UseRouting();
            app.UseCors("DefaultCorsPolicy");
            app.UseRateLimiter();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            Log.Information("Vevada API started successfully");
            await app.RunAsync();
        }
        catch (HostAbortedException)
        {
            // The EF Core tools throw this exception intentionally to stop the web server from actually starting
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