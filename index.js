// index.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let clients = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.log('Invalid JSON:', message);
      return;
    }

    const { type, from, to, payload } = data;

    switch (type) {
      case 'register':
        clients[from] = ws;
        break;
      case 'offer':
      case 'answer':
      case 'ice':
        if (clients[to]) {
          clients[to].send(JSON.stringify({ type, from, payload }));
        }
        break;
    }
  });

  ws.on('close', () => {
    for (const id in clients) {
      if (clients[id] === ws) {
        delete clients[id];
        break;
      }
    }
  });
});

console.log('Signaling server running on port 8080');
