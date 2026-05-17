# Vevada Project: Active Technical Debt

**Feature:** Image Infrastructure
**Date:** May 14, 2026

This document tracks the active technical debt and accepted edge cases that remain in the current implementation.

## 1. Accepted Edge Case: Concurrent Upload Race Condition
* **Current State:** Optimistic concurrency handling for duplicate file uploads was intentionally skipped (YAGNI principle).
* **The Scenario:** If two users upload the *exact same file* at the *exact same millisecond*, both will pass the initial "does this hash exist" check. One thread will save successfully; the other will hit a PostgreSQL Unique Constraint Violation on the `Hash` column and return a 500 Server Error.
* **Future Action:** Acknowledged and accepted for the MVP phase. If concurrent identical uploads become an issue at scale, the MediatR handler should be updated to catch the `DbUpdateException` (SqlState "23505"), query the existing ID, and return it to the user.
