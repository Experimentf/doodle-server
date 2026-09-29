// Bot swarm: each bot joins a public room and plays like a real user (draws, guesses, picks words).
// Usage: TARGET=<server-url> ORIGIN=<client-url> BOTS=200 RAMP_MS=100 DURATION_S=300 node bots.mjs
import { io } from 'socket.io-client';

const TARGET = process.env.TARGET ?? 'http://localhost:5000';
const ORIGIN = process.env.ORIGIN ?? 'http://localhost:3000';
const BOTS = Number(process.env.BOTS ?? 50);
const RAMP_MS = Number(process.env.RAMP_MS ?? 100);
const DURATION_S = Number(process.env.DURATION_S ?? 120);
// Real client emits one op per pointer-move (~60/s) while dragging; bots draw in bursts.
const DRAW_HZ = Number(process.env.DRAW_HZ ?? 30);
const HUNCH_EVERY_MS = Number(process.env.HUNCH_EVERY_MS ?? 4000);

const stats = { connected: 0, connectErrors: 0, disconnects: 0, ackErrors: 0, timeouts: 0, received: 0, sent: 0, latencies: [] };
const rooms = new Set();
const sockets = [];

const emitAck = (socket, event, payload) => {
  const start = performance.now();
  stats.sent++;
  return socket
    .timeout(10000)
    .emitWithAck(event, payload)
    .then((res) => {
      stats.latencies.push(performance.now() - start);
      if (res?.error) stats.ackErrors++;
      return res;
    })
    .catch(() => {
      stats.timeouts++;
    });
};

function startBot(i) {
  const socket = io(TARGET, {
    transports: ['websocket'],
    extraHeaders: { Origin: ORIGIN },
    reconnection: false,
    forceNew: true
  });
  sockets.push(socket);

  let roomId;
  let myId;
  let drawTimer;
  let hunchTimer;

  const stopDrawing = () => clearInterval(drawTimer);

  socket.onAny(() => stats.received++);
  socket.on('connect_error', () => stats.connectErrors++);
  socket.on('disconnect', () => {
    stats.disconnects++;
    stopDrawing();
    clearInterval(hunchTimer);
  });

  socket.on('connect', async () => {
    stats.connected++;
    const setRes = await emitAck(socket, 'set-doodler', { name: `bot-${i}`, avatar: {} });
    myId = setRes?.data?.id;
    const joinRes = await emitAck(socket, 'add-doodler-to-public-room');
    roomId = joinRes?.data?.roomId;
    if (roomId) rooms.add(roomId);

    hunchTimer = setInterval(() => {
      emitAck(socket, 'game-hunch', { roomId, message: `guess-${Math.random().toString(36).slice(2, 7)}` });
    }, HUNCH_EVERY_MS + Math.random() * 1000);
  });

  socket.on('game-status-updated', ({ room, game, statusChangeData }) => {
    stopDrawing();
    const isDrawer = room?.drawerId === myId;
    if (!isDrawer) return;

    if (game?.status === 'in_choose_word') {
      const word = statusChangeData?.in_choose_word?.wordOptions?.[0];
      if (word) setTimeout(() => emitAck(socket, 'game-choose-word', { roomId, word }), 1000);
    } else if (game?.status === 'in_game') {
      let x = Math.random(), y = Math.random();
      drawTimer = setInterval(() => {
        const nx = Math.min(1, Math.max(0, x + (Math.random() - 0.5) * 0.02));
        const ny = Math.min(1, Math.max(0, y + (Math.random() - 0.5) * 0.02));
        emitAck(socket, 'game-canvas-operation', {
          roomId,
          canvasOperation: { actionType: 'line', points: [{ x, y }, { x: nx, y: ny }], color: '#000000', size: 0.01 }
        });
        x = nx; y = ny;
      }, 1000 / DRAW_HZ);
    }
  });
}

const pct = (arr, p) => (arr.length ? arr.sort((a, b) => a - b)[Math.floor((arr.length - 1) * p)].toFixed(0) : '-');

const reporter = setInterval(() => {
  const l = stats.latencies;
  console.log(
    `conn=${stats.connected} rooms=${rooms.size} sent=${stats.sent} recv=${stats.received} ` +
      `ack p50=${pct(l, 0.5)}ms p95=${pct(l, 0.95)}ms p99=${pct(l, 0.99)}ms ` +
      `timeouts=${stats.timeouts} ackErr=${stats.ackErrors} connErr=${stats.connectErrors} dc=${stats.disconnects}`
  );
  stats.latencies = [];
  stats.sent = 0;
  stats.received = 0;
}, 5000);

for (let i = 0; i < BOTS; i++) setTimeout(() => startBot(i), i * RAMP_MS);

setTimeout(() => {
  clearInterval(reporter);
  sockets.forEach((s) => s.disconnect());
  console.log('done');
  setTimeout(() => process.exit(0), 500);
}, BOTS * RAMP_MS + DURATION_S * 1000);
