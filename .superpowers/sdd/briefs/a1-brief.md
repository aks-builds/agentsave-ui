# Task A1: Backend — Add GET /api/events/recent endpoint

## Context
Adding the `/api/events/recent` endpoint to the AgentSave dashboard FastAPI backend. This endpoint is consumed by the UI's live activity feed component (Task A12). It must be JWT-authenticated (not API token authenticated).

## Project
Backend root: `C:/Users/AdityaKumarSingh/agentsave-dashboard/`
No git operations.

## What to do

### Step 1: Read existing events.py to understand the current structure
Read: `C:/Users/AdityaKumarSingh/agentsave-dashboard/agentsave_dashboard/routers/events.py`
Read: `C:/Users/AdityaKumarSingh/agentsave-dashboard/tests/test_events.py`

Note how `_seed_project` helper and `VALID_PAYLOAD` are defined in the test file — you'll use them in the new tests.

### Step 2: Add 3 tests to test_events.py

Append these three tests at the end of `tests/test_events.py`:

```python
@pytest.mark.asyncio
async def test_recent_events_endpoint(client, db):
    """GET /api/events/recent returns events for the project, newest first, limited."""
    from agentsave_dashboard.auth import create_jwt

    project_id, raw_token, user_id = await _seed_project(db)

    payload1 = dict(VALID_PAYLOAD, run_id="run-001", timestamp="2026-06-23T10:00:00Z")
    payload2 = dict(VALID_PAYLOAD, run_id="run-002", timestamp="2026-06-23T11:00:00Z")
    await client.post("/api/events", json=payload1, headers={"Authorization": f"Bearer {raw_token}"})
    await client.post("/api/events", json=payload2, headers={"Authorization": f"Bearer {raw_token}"})

    cursor = await db.execute("SELECT tier FROM users WHERE id = ?", (user_id,))
    row = await cursor.fetchone()
    jwt = create_jwt(user_id, "events@example.com", row["tier"])

    response = await client.get(
        f"/api/events/recent?project_id={project_id}&limit=10",
        headers={"Authorization": f"Bearer {jwt}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["run_id"] == "run-002"
    assert data[1]["run_id"] == "run-001"
    assert "id" in data[0]
    assert "framework" in data[0]
    assert "tokens_before" in data[0]
    assert "tokens_after" in data[0]
    assert "task_success" in data[0]
    assert "timestamp" in data[0]


@pytest.mark.asyncio
async def test_recent_events_endpoint_requires_jwt(client, db):
    """GET /api/events/recent rejects raw API tokens (requires JWT, not SDK token)."""
    project_id, raw_token, _ = await _seed_project(db)
    response = await client.get(
        f"/api/events/recent?project_id={project_id}&limit=10",
        headers={"Authorization": f"Bearer {raw_token}"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_recent_events_limit_respected(client, db):
    """GET /api/events/recent returns at most `limit` events."""
    from agentsave_dashboard.auth import create_jwt

    project_id, raw_token, user_id = await _seed_project(db)

    for i in range(5):
        p = dict(VALID_PAYLOAD, run_id=f"run-{i:03d}", timestamp=f"2026-06-23T{10+i:02d}:00:00Z")
        await client.post("/api/events", json=p, headers={"Authorization": f"Bearer {raw_token}"})

    cursor = await db.execute("SELECT tier FROM users WHERE id = ?", (user_id,))
    row = await cursor.fetchone()
    jwt = create_jwt(user_id, "events@example.com", row["tier"])

    response = await client.get(
        f"/api/events/recent?project_id={project_id}&limit=3",
        headers={"Authorization": f"Bearer {jwt}"},
    )
    assert response.status_code == 200
    assert len(response.json()) == 3
```

Run: `cd C:/Users/AdityaKumarSingh/agentsave-dashboard && pytest tests/test_events.py::test_recent_events_endpoint tests/test_events.py::test_recent_events_endpoint_requires_jwt tests/test_events.py::test_recent_events_limit_respected -v`
Expected: 3 FAILED (404 - endpoint not yet created)

### Step 3: Add endpoint to events.py

In `agentsave_dashboard/routers/events.py`:
1. Add `require_jwt` to the auth import (it's currently only `verify_api_token`)
2. Add the new route after the existing `receive_event` function

The route path must be `/recent` (relative to the router prefix). Check what prefix the router is mounted with in `main.py` to ensure the full path becomes `/api/events/recent`.

```python
@router.get("/recent")
async def get_recent_events(
    project_id: str,
    limit: int = 10,
    payload: dict = Depends(require_jwt),
    db: aiosqlite.Connection = Depends(get_db),
) -> list[dict]:
    cursor = await db.execute(
        "SELECT id, run_id, framework, model_name, tokens_before, tokens_after, "
        "iterations_total, iterations_saved, task_success, timestamp "
        "FROM events WHERE project_id = ? ORDER BY timestamp DESC LIMIT ?",
        (project_id, limit),
    )
    rows = await cursor.fetchall()
    return [dict(row) for row in rows]
```

### Step 4: Run full test suite
Run: `cd C:/Users/AdityaKumarSingh/agentsave-dashboard && pytest tests/test_events.py -v`
Expected: all existing tests + 3 new = passing total (8 tests)

Also run: `pytest tests/ -v`
Expected: all 44+ tests still pass.

## Report
Write to: `C:/Users/AdityaKumarSingh/agentsave-ui/.superpowers/sdd/briefs/a1-report.md`
Return: DONE/BLOCKED, test count, any issues.
