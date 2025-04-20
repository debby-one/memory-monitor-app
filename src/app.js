const express = require('express');
const { checkMemoryUsage } = require('./monitor/memory');
const { checkSwapUsage } = require('./monitor/swap');
const { sendNotification } = require('./notifier/notify');
const os = require('os');
const { execSync } = require('child_process');
require('dotenv').config();

const app = express();

app.use(express.static('public'));

const MEMORY_THRESHOLD = process.env.THRESHOLD_MEMORY || 80; // Default to 80%
const SWAP_THRESHOLD = process.env.THRESHOLD_SWAP || 80; // Default to 80%
const PORT = process.env.PORT || 8080; // Default to 3000
const HOST = process.env.HOST || '0.0.0.0'; // Default to localhost

const memoryHistory = [];
const swapHistory = [];
const MAX_HISTORY = 24 * 60; // 最大24時間分（1分ごとに記録）

function getSwapUsage() {
    try {
        const output = execSync('free -b').toString(); // スワップ情報を取得
        console.log('free command output:', output); // デバッグ用ログ
        const lines = output.split('\n');
        const swapLine = lines.find(line => line.startsWith('Swap:'));
        if (swapLine) {
            const [, total, used] = swapLine.trim().split(/\s+/).map(Number);
            return { total, used };
        }
    } catch (error) {
        console.error('Error fetching swap usage:', error);
    }
    return { total: 0, used: 0 };
}

function monitorResources() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(2);

    const { total: totalSwap, used: usedSwap } = getSwapUsage();
    const swapUsagePercent = totalSwap > 0 ? ((usedSwap / totalSwap) * 100).toFixed(2) : 0;

    // デバッグ用ログ
    console.log('Memory Usage:', memoryUsagePercent);
    console.log('Swap Usage:', swapUsagePercent);

    // 履歴に追加
    memoryHistory.push({ timestamp: Date.now(), usagePercent: memoryUsagePercent });
    swapHistory.push({ timestamp: Date.now(), usagePercent: swapUsagePercent });

    // デバッグ用ログ: 履歴の内容を確認
    console.log('Memory History:', memoryHistory);
    console.log('Swap History:', swapHistory);

    // 履歴の長さを制限
    if (memoryHistory.length > MAX_HISTORY) memoryHistory.shift();
    if (swapHistory.length > MAX_HISTORY) swapHistory.shift();

    // しきい値を超えた場合に通知
    if (memoryUsagePercent > MEMORY_THRESHOLD) {
        sendNotification('Memory usage exceeded threshold!');
    }
    if (swapUsagePercent > SWAP_THRESHOLD) {
        sendNotification('Swap usage exceeded threshold!');
    }
}

setInterval(monitorResources, 5000); // 5秒ごとにリソースを監視

app.get('/', (req, res) => {
    res.send('Memory and swap monitoring service is running.');
});

// エンドポイント: メモリとスワップの使用状況を取得
app.get('/api/usage', (req, res) => {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(2);

    const { total: totalSwap, used: usedSwap } = getSwapUsage();
    const swapUsagePercent = totalSwap > 0 ? ((usedSwap / totalSwap) * 100).toFixed(2) : 0;

    res.json({
        memory: {
            total: totalMemory,
            used: usedMemory,
            usagePercent: memoryUsagePercent,
        },
        swap: {
            total: totalSwap,
            used: usedSwap,
            usagePercent: swapUsagePercent,
        },
    });
});

// 履歴データを取得するエンドポイント
app.get('/api/history', (req, res) => {
    res.json({
        memory: memoryHistory,
        swap: swapHistory,
        thresholds: {
            memory: MEMORY_THRESHOLD,
            swap: SWAP_THRESHOLD,
        },
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});