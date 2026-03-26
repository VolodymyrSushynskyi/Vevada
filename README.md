# Vevada

This is Vevada project



# Project conventions

## Branching
Some rules we stick to when dealing with git branches.

### Naming conventions
Branch name should start with following prefixes, that indicate type of functionality being merged:
* feature/ - New functionality (e.g., feature/login-page)
* bug/ - Fixing a bug in non-production code (e.g., bug/button-color)
* hotfix/ - Urgent fix for Production breakage (e.g., hotfix/crash-on-startup)
* chore/ - Maintenance work that isn't code (e.g., chore/update-dependencies)
* refactor/ - Changing code structure without changing behavior (e.g., refactor/user-service)
* docs/ - Documentation only (e.g., docs/update-readme)

Branches are named using kebab-case, following the next pattern:
`(functionality type)/[ticket number if it exists]-(ticket name or it's shortened version)`

Here are some examples:
- `hotfix/123-crash-on-startup`
- `refactor/23-fix-user-service-namings`
- `docs/update-readme--branch-convention`

Also keep branch names short, but at the same time avoid very abstract names like "hotfix/fix" or "feature/user"


### Branching strategy
1. Separate branch for everything - feature, bugfix, refactor etc.
2. Everything goes derictly into main, no branches for "version 1.0".
3. Branches are merged into main only via pill requests, no direct merges are allowed.
4. Pull requests have checks that need to be passed before merging pull request into main.
