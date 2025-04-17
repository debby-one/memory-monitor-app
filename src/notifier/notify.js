const { Notification } = require('electron');

function sendNotification(message) {
    const notification = new Notification({
        title: 'Memory Monitor Alert',
        body: message,
    });

    notification.show();
}

module.exports = { sendNotification };