const { checkMemoryUsage } = require('./monitor/memory');
const { checkSwapUsage } = require('./monitor/swap');
const { sendNotification } = require('./notifier/notify');
require('dotenv').config();

const MEMORY_THRESHOLD = process.env.MEMORY_THRESHOLD || 80; // Default to 80%
const SWAP_THRESHOLD = process.env.SWAP_THRESHOLD || 80; // Default to 80%

function monitorResources() {
    checkMemoryUsage(MEMORY_THRESHOLD);
    checkSwapUsage(SWAP_THRESHOLD);
}

setInterval(monitorResources, 60000); // Check every minute

console.log('Memory and swap monitoring started.');