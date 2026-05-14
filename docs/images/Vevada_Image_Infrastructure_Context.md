# Vevada Project: Image Infrastructure Feature Summary

**Feature:** Scalable, Deduplicated Image Upload, Processing, Storage, and Automated Cleanup.
**Architecture:** Clean Architecture / Feature-Sliced (.NET 8, PostgreSQL, MediatR, FluentValidation, SixLabors.ImageSharp).

---

## 1. Core Architectural Decisions

* **"Files First, Database Last":** Physical files are processed and saved to the Linux/Windows disk *before* opening an Entity Framework Core database transaction. This prevents locking up the PostgreSQL connection pool during slow disk/CPU I/O operations.
* **Client-Generated IDs:** The `ImageAsset` primary key is a C#-generated `Guid` created prior to database insertion, allowing files to be securely named and saved before the database is aware of them.
* **Deduplication:** Images are hashed (SHA-256) upon upload. If the hash already exists in the database, the upload is skipped, and the existing `Guid` is returned to save storage space.
* **Eventual Consistency (Cleanup):** To handle database failures during the "Files First" approach, a nightly Garbage Collector safely sweeps up orphaned physical files and abandoned database records.
* **Immutable Assets:** Images are never updated. They are shared assets. Explicit deletion is prohibited; instead, we rely on PostgreSQL Foreign Keys (`Restrict`) and background cleanup to safely remove unused images.

---

## 2. Component Breakdown

### A. Configuration (`ImageSettings`)
Fully driven by `appsettings.json` via the Options Pattern:
* `StoragePath`: Location of physical files (e.g., `Storage/Images`).
* `MaxFileSizeMb`: 5MB limit.
* `AllowedContentTypes`: JPEG, PNG, WEBP.
* `MaxWidth`/`MaxHeight`: 1920x1080.
* `ThumbnailSize`: 400px.
* `WebpQuality`: 80.
* `OrphanedImageCutoffHours`: 24 hours.

### B. Validation (`UploadImageCommandValidator`)
Uses `FluentValidation` intercepting the `IFormFile`:
* Checks file existence, size (< 5MB), Content-Type (MIME), and extension.
* Validates magic bytes (file signature) to prevent malicious executable masquerading.

### C. Image Processing (`ImageProcessingService`)
Uses `SixLabors.ImageSharp` for heavy lifting:
* Converts all incoming images to highly optimized `.webp` format.
* Resizes images exceeding `MaxWidth`/`MaxHeight` maintaining aspect ratio.
* Generates a thumbnail (`{Guid}-thumb.webp`) using `ResizeMode.Crop`.
* Saves a full-size version (`{Guid}-full.webp`).
* Contains an idempotent `DeleteImageFiles(Guid)` helper method for safe removal.

### D. The MediatR Handler (`UploadImageCommandHandler`)
The orchestrator for the HTTP request:
1.  Computes SHA-256 hash of the incoming stream.
2.  Checks DB for existing hash (Returns existing ID if found).
3.  Generates new `Guid`.
4.  Calls `ImageProcessingService` to write files to disk.
5.  Creates `ImageAsset` entity and calls `_dbContext.SaveChangesAsync()`.
6.  Returns the `Guid` to the client.

### E. The Garbage Collector (`OrphanedImageCleanupService`)
An `IHostedService` (`BackgroundService`) that calculates time until a specific nightly hour (e.g., 3:00 AM) and `awaits` a task delay, consuming zero CPU threads while waiting.

Runs a two-phase cleanup:
* **Phase 1 (Physical Clean):** Scans the `StoragePath` for files older than 24 hours. Compares the filename GUIDs against the `ImageAssets` table. Deletes files with no matching database row (handles DB transaction failures).
* **Phase 2 (Database Clean):** Queries the `ImageAssets` table for records older than 24 hours. Attempts to delete them and call `SaveChangesAsync()`. If PostgreSQL throws a `DbUpdateException` (due to Foreign Key constraints from consumer entities like Products), it ignores the error. If successful, it means the image is completely abandoned, and it deletes the physical files.

### F. Serving Files (`UseImageStaticFiles` Middleware)
* Exposes a read-only, high-speed tunnel to the physical storage folder via `UseStaticFiles()` and `PhysicalFileProvider`.
* Route: `/content/images/{filename}`.
* Injected into the `Program.cs` pipeline **before** `UseAuthentication()`, allowing public internet access (for e-commerce product viewing) while completely bypassing the MVC/Controller lifecycle for maximum performance.

---

## 3. Database Schema / Integration

* **Entity:** `ImageAsset`
    * `Id` (Guid, PK)
    * `Hash` (String, Indexed)
    * `OriginalWidth`, `OriginalHeight` (Int)
    * `CreatedAt` (DateTimeOffset)
* **Consumer Integration (Future Setup):** Any entity that requires an image (e.g., `Product`) adds a foreign key mapping to `ImageAsset.Id`. The EF Core relationship **MUST** be set to `OnDelete(DeleteBehavior.Restrict)` to allow the Garbage Collector's Foreign Key Exception trick to work correctly.
