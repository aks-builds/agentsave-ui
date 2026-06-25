#!/usr/bin/env python
"""Seed the SP1 agentsave-dashboard backend with demo data.

Usage:
  python scripts/seed_sp1.py --key ask-your-key-here
  python scripts/seed_sp1.py  # reads AGENTSAVE_API_KEY env var
"""
import argparse
import os
import random
import sys
import json
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta

API_URL = os.environ.get("AGENTSAVE_API_URL", "http://localhost:8000")

parser = argparse.ArgumentParser()
parser.add_argument("--key", default=os.environ.get("AGENTSAVE_API_KEY", ""))
parser.add_argument("--count", type=int, default=30)
parser.add_argument("--url", default=API_URL)
args = parser.parse_args()

if not args.key:
    print("ERROR: provide --key or set AGENTSAVE_API_KEY", file=sys.stderr)
    sys.exit(1)

FRAMEWORKS = ["langchain", "autogen", "crewai", "smolagents", "langgraph"]
MODELS = ["gpt-4o", "claude-sonnet-4-6", "gemini-2.5-pro", "gpt-4o-mini"]


def post(path, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        f"{args.url}{path}",
        data=body,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {args.key}"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} on {path}: {e.read().decode()}", file=sys.stderr)
        sys.exit(1)


total_saved = 0
for i in range(args.count):
    tokens_before = random.randint(800, 3000)
    reduction = random.uniform(0.18, 0.45)
    tokens_after = int(tokens_before * (1 - reduction))
    ts = (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 29))).isoformat()
    run = {
        "run_id": f"seed-run-{i:04d}-{random.randint(1000,9999)}",
        "framework": random.choice(FRAMEWORKS),
        "model_name": random.choice(MODELS),
        "tokens_before": tokens_before,
        "tokens_after": tokens_after,
        "iterations_total": random.randint(1, 8),
        "iterations_saved": random.randint(0, 3),
        "task_success": random.random() > 0.1,
        "timestamp": ts,
    }
    post("/api/events", run)
    total_saved += tokens_before - tokens_after
    if (i + 1) % 10 == 0:
        print(f"  seeded {i+1}/{args.count} runs")

print(f"OK Seeded {args.count} runs, ~{total_saved:,} tokens saved")
print(f"   Run: AGENTSAVE_API_KEY={args.key} npm run dev")
