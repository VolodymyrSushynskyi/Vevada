# Context: Vevada Project - Image Infrastructure (Docker \& Deployment)

I am building a full-stack application (Angular frontend, .NET 8 API, PostgreSQL database) deployed via Docker Compose on a Linux VPS.

We have successfully implemented a "Files First, Database Last" image architecture. The .NET API processes the upload using `SixLabors.ImageSharp`, generates a new GUID for each upload, and saves two files (`{guid}-thumb.webp` and `{guid}-full.webp`) directly to the disk. The PostgreSQL database only stores the GUID and metadata to maintain referential integrity.

I am now ready to configure the production infrastructure and security for this feature.

## Required Architecture to Implement:

1. **Docker Shared Volumes:** \* The .NET API currently saves files locally to `Storage/Images`.

   * I need to configure `docker-compose.yml` so that both the `.net-api` container and the `nginx` reverse proxy container share a named volume or host directory mapping (e.g., `/var/vevada/storage/images`).
2. **Nginx Configuration (High-Performance Serving):** \* **Payload Limit:** Nginx needs to instantly drop payloads larger than 5MB (`client\_max\_body\_size 5M`) to prevent the API from being choked by massive file uploads.

   * **Static Serving:** Nginx must intercept requests matching the route `/content/images/` and serve the `.webp` files directly from the shared volume. This will bypass the .NET API's `UseStaticFiles` middleware in production, maximizing throughput.
3. **API Security (Rate Limiting):** \* The `POST /api/images` endpoint must be protected against spam/DDoS.

   * I need to implement .NET 8's built-in Rate Limiting middleware (e.g., configuring `\[EnableRateLimiting("ImageUploadLimit")]` for a max of 10 requests per minute per IP/User).
4. **Garbage Collection (Implemented):** \* A .NET `BackgroundService` (`OrphanedImageCleanupService`) is already built. It runs nightly to delete orphaned physical files (older than 24h with no DB match) and abandoned database records (using PostgreSQL Foreign Key exception catching).

