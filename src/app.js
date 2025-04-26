const express = require('express');
require('dotenv').config();

const app = express();
const monitoredMachines = {}; // 監視対象マシンのデータを保持

app.use(express.static('public'));

const MEMORY_THRESHOLD = process.env.THRESHOLD_MEMORY || 80; // Default to 80%
const SWAP_THRESHOLD = process.env.THRESHOLD_SWAP || 80; // Default to 80%
const PORT = process.env.PORT || 8080; // Default to 3000
const HOST = process.env.HOST || '0.0.0.0'; // Default to localhost

app.get('/', (req, res) => {
    res.send('Memory and swap monitoring service is running.');
});

app.post('/api/report', express.json(), (req, res) => {
    const { hostname, memoryUsage, swapUsage, topProcesses } = req.body;

    if (!hostname || memoryUsage === undefined || swapUsage === undefined || !topProcesses) {
        return res.status(400).send('Invalid data');
    }

    if (!monitoredMachines[hostname]) {
        monitoredMachines[hostname] = [];
    }

    monitoredMachines[hostname].push({
        memoryUsage,
        swapUsage,
        topProcesses: topProcesses.split('\\n'), // 改行で分割して配列に変換
        timestamp: Date.now(),
    });

    // 履歴の長さを制限（例: 最大100件）
    if (monitoredMachines[hostname].length > 100) {
        monitoredMachines[hostname].shift();
    }

    res.status(200).send('Data received');
});

app.get('/api/machines', (req, res) => {
    const latestData = {};
    Object.keys(monitoredMachines).forEach((hostname) => {
        const history = monitoredMachines[hostname];
        latestData[hostname] = history[history.length - 1]; // 最新データを取得
    });
    res.json(latestData);
});

// しきい値を取得するエンドポイント
app.get('/api/thresholds', (req, res) => {
    res.json({
        memory: MEMORY_THRESHOLD,
        swap: SWAP_THRESHOLD,
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});