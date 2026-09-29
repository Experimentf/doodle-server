# Tools

Operational tooling for `doodle-server`. Not part of the server build or Docker image.

## `loadtest/` — bot swarm

Each bot connects over Socket.IO and plays like a real client: joins a public room,
draws when it's the drawer (picks a word, streams `game-canvas-operation`), and sends
guesses otherwise.

```bash
cd tools/loadtest && npm install
TARGET=<server-url> ORIGIN=<client-url> \
  BOTS=50 RAMP_MS=100 DURATION_S=150 node bots.mjs
```

| Env | Default | Meaning |
|---|---|---|
| `TARGET` | `http://localhost:5000` | Server URL |
| `ORIGIN` | `http://localhost:3000` | Sent as `Origin`; must be in the server's `DOODLE_CLIENT_URL` |
| `BOTS` | `50` | Bots to connect (8 per public room) |
| `RAMP_MS` | `100` | Delay between bot connects |
| `DURATION_S` | `120` | How long to run after ramp-up |
| `DRAW_HZ` | `30` | Canvas ops/s per drawer (real client can send ~60) |
| `HUNCH_EVERY_MS` | `4000` | Guess interval per bot |

Every 5s it prints connected bots, rooms, messages sent/received, ack latency
p50/p95/p99, and timeouts/errors/disconnects.

- Healthy: p95 flat, `timeouts=0`, `recv` ≈ 7× `sent` (fan-out to the other 7 in a room).
- Stop when p95 > 500ms or timeouts appear.
- Ack latency includes network RTT. Beyond ~100 bots, run from a VM in the server's
  region so the load generator's connection isn't the bottleneck.
- Always watch the Grafana dashboard alongside: CPU, event-loop lag and memory tell you
  whether latency comes from the server or the network.

### Baseline (2026-09-29, after the canvas-ack fix)

| Bots | Rooms | CPU (1 core) | Event-loop lag p99 | Peak RSS | Timeouts |
|---|---|---|---|---|---|
| 50 | 7 | ~13% | ~15ms | ~90MB | 0 |
| 100 | 13 | ~21% | ~17ms | ~100MB | 0 |

## `monitoring/` — Grafana Cloud

The server exposes `GET /health` (open) and `GET /metrics` (Prometheus format,
`Authorization: Bearer $METRICS_TOKEN`), scraped by Grafana Alloy and shipped to Grafana Cloud.

- `grafana-dashboard.json` — import via Dashboards → New → Import, pick the Prometheus
  data source when prompted.
