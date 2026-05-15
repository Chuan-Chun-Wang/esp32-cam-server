const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 讓 Express 提供靜態網頁 (我們等一下會寫的 index.html)
app.use(express.static('public'));

// WebSocket 連線邏輯
wss.on('connection', (ws) => {
  console.log('有新的連線加入了！');

  ws.on('message', (message) => {
    // 當伺服器收到訊息 (這會是 ESP32 傳來的影像資料)
    // 把它廣播給所有正在連線的客戶端 (瀏覽器)
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('連線已斷開');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`伺服器已啟動，監聽 Port ${PORT}`);
});