const { exec } = require('child_process');
const { sendNotification } = require('../notifier/notify');
require('dotenv').config();

const MEMORY_THRESHOLD = process.env.MEMORY_THRESHOLD || 80; // デフォルトは80%
const CHECK_INTERVAL = process.env.CHECK_INTERVAL || 5000; // 5秒ごとにチェック

function checkMemoryUsage() {
    exec('free -m', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            return;
        }
        const lines = stdout.trim().split('\n');
        const memoryLine = lines[1].split(/\s+/);
        const totalMemory = parseInt(memoryLine[1]);
        const usedMemory = parseInt(memoryLine[2]);
        const usedPercentage = (usedMemory / totalMemory) * 100;

        console.log(`Used Memory: ${usedPercentage.toFixed(2)}%`);

        if (usedPercentage > MEMORY_THRESHOLD) {
            sendNotification(`Memory usage is high: ${usedPercentage.toFixed(2)}%`);
        }
    });
}

//setInterval(checkMemoryUsage, CHECK_INTERVAL);