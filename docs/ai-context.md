# Project Context: Vevada

## 1. Project Overview
* **Name:** Vevada
* **Type:** Full-stack web application
* **Backend:** .NET 8 (C#) API structured with Clean Architecture and Feature-Sliced Design.
* **Frontend:** Angular
* **Database:** PostgreSQL 16
* **Current Focus:** Infrastructure is fully deployed; transitioning back to core domain logic and feature slices.

## 2. Infrastructure & Hosting
* **Server:** Ubuntu VPS (IP: 95.169.204.46)
* **Domain:** `vevada.uk` and `api.vevada.uk` (Registered and managed via Cloudflare DNS).
* **Containerization:** The entire stack is containerized using Docker and orchestrated with `docker-compose`.
* **Reverse Proxy:** Caddy (v2) is used as the edge router. It handles traffic routing between the Angular and .NET containers and automatically manages Let's Encrypt SSL certificates.
* **Security:** * Cloudflare proxy status is set to "DNS Only" (Grey Cloud) to allow Caddy to handle end-to-end HTTPS encryption.
  * Internal container ports (e.g., API on 8080, Frontend on 80) are NOT exposed directly to the host machine. Caddy handles all external routing.
  * UFW Firewall is enabled, restricting external access to HTTP (80), HTTPS (443), and SSH (22).

## 3. CI/CD Pipeline
* **Automation:** GitHub Actions workflow (`deploy.yml` and `pr-build-check.yml`) is fully configured.
* **Build Validation:** PRs to `main` trigger a mandatory build check (`validate-build`) that compiles the Docker images to prevent broken merges. Branch protection rules are enforced.
* **Deployment:** Merging to `main` securely triggers an SSH-based deployment to the VPS, which pulls the latest code and restarts the Docker containers automatically. Principle of Least Privilege is enforced via GitHub token permissions.

## 4. Completed Milestones
* [x] **Authentication/Authorization:** JWT-based auth system is fully implemented in the .NET backend.
* [x] **Database:** Migrated from local development to a Dockerized Postgres environment.
* [x] **Code Quality:** Refactored complex SQL queries to mitigate injection risks (implemented Query Builder pattern).
* [x] **DevOps:** CI/CD pipeline, VPS configuration, Dockerization, and reverse proxy setup are 100% complete.
* [x] **DNS/SSL:** Custom domain configured with valid HTTPS certificates.

## 5. Immediate Next Steps
* **CORS Configuration:** Update the .NET API middleware to explicitly allow Cross-Origin Resource Sharing for `https://vevada.uk` so the Angular frontend can successfully communicate with `https://api.vevada.uk`.
* **Testing:** Implement automated unit and integration tests (and wire them into the GitHub Actions pipeline).
* **Feature Development:** Resume building out the next core feature slices in C# using Clean Architecture principles.