const { exec } = require('child_process');
const { sendNotification } = require('../notifier/notify');
require('dotenv').config();

const SWAP_THRESHOLD = process.env.SWAP_THRESHOLD || 80; // デフォルトの閾値を80%に設定

function checkSwapUsage() {
    exec('free | grep Swap', (error, stdout, stderr) => {
        if (error) {
            console.error(`エラー: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`エラー: ${stderr}`);
            return;
        }

        const swapInfo = stdout.trim().split(/\s+/);
        const totalSwap = parseInt(swapInfo[1]);
        const usedSwap = parseInt(swapInfo[2]);
        const usedPercentage = (usedSwap / totalSwap) * 100;

        console.log(`スワップ使用量: ${usedPercentage.toFixed(2)}%`);

        if (usedPercentage > SWAP_THRESHOLD) {
            sendNotification(`警告: スワップ使用量が${SWAP_THRESHOLD}%を超えました。現在の使用量は${usedPercentage.toFixed(2)}%です。`);
        }
    });
}

module.exports = { checkSwapUsage };