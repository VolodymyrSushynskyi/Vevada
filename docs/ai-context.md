# Project Context: Vevada
Please adopt this context for our conversation. I am building a full-stack application with a .NET 8 API and an Angular frontend. 

## 1. Environment & Infrastructure
*   **Structure:** Monorepo (`src/backend/Vevada` and `src/frontend`).
*   **Deployment:** Dockerized containers (API, Database, Frontend) running on a Linux VPS via `docker-compose`.
*   **Configuration:** Production uses server-level environment variables injected via Docker `.env`. Local development uses .NET User Secrets.

## 2. Backend Stack & Architecture (.NET 8)
*   **Architecture:** 3-Tier architecture, but the Business layer is organized using a **Feature-Sliced (Vertical Slice)** approach (grouping DTOs, handlers, and services by feature, not by type).
*   **Projects:**
    *   `Vevada.Api`: Presentation layer. Controllers, Middleware, Swagger, JWT config.
    *   `Vevada.Business`: Core logic. Uses AutoMapper, FluentValidation, MediatR.
    *   `Vevada.Data`: Data access. Uses EF Core, ASP.NET Core Identity, and PostgreSQL (`Npgsql`).

## 3. Established Patterns (Do Not Suggest Changing These)
*   **The "Two Shields" Error Handling:**
    *   **Expected Business Errors:** Handled gracefully via MediatR pipeline. Handlers never throw exceptions for business rules; they return a custom `HandlerResult<T>` object containing `IsSuccess`, `Value`, and `Error` (string).
    *   **Unexpected System Crashes:** Handled globally by a custom .NET 8 `IExceptionHandler`. It logs the stack trace as Critical/Error via Serilog and returns a safe standard 500 `ProblemDetails` JSON. It also safely catches `OperationCanceledException` (client disconnects).
*   **Validation:** FluentValidation runs concurrently in the MediatR pipeline (`ValidationBehavior`). If validation fails, it throws a `ValidationException` which the Global Exception Handler catches to return a 400 `ValidationProblemDetails`.
*   **Logging:** Serilog is fully implemented. Console sink for dev, `CompactJsonFormatter` to a file for production.
*   **Base Controller:** `ApiControllerBase` automatically maps `HandlerResult<T>` to standard HTTP 200/400/404 responses, wrapping string errors into `ProblemDetails` to match the global exception format.