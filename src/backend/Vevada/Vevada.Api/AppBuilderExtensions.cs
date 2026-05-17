using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Vevada.Business.ImageProcessing.Models;

namespace Vevada.Api;

public static class AppBuilderExtensions
{
    public static WebApplication UseImageStaticFiles(this WebApplication app)
    {
        var imageSettings = app.Services.GetRequiredService<IOptions<ImageSettings>>().Value;

        var storagePath = Path.Combine(app.Environment.ContentRootPath, imageSettings.StoragePath);

        if (!Directory.Exists(storagePath))
        {
            Directory.CreateDirectory(storagePath);
        }

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(storagePath),
            RequestPath = imageSettings.RequestPath
        });

        return app;
    }
}
