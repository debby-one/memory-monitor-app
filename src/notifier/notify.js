const notifier = require('node-notifier');

function sendNotification(message) {
    notifier.notify({
        title: 'Memory Monitor',
        message: message,
        sound: true, // 通知音を有効にする
        wait: false, // ユーザーの応答を待たない
    });
}

module.exports = { sendNotification };