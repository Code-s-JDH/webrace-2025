"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const web_push_1 = __importDefault(require("web-push"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const app = (0, express_1.default)();
const port = 3100;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Your VAPID keys, which you'll use to authenticate your server
const vapidKeys = web_push_1.default.generateVAPIDKeys();
// Set up VAPID details
web_push_1.default.setVapidDetails('mailto:example@yourdomain.com', // Email for VAPID details
vapidKeys.publicKey, // Public key
vapidKeys.privateKey // Private key
);
// Configuration setup
const config = {
    port: 5672,
    rabbitMQUrl: 'amqp://rabbitmq',
    vapidDetails: {
        subject: 'mailto:example@yourdomain.com',
        publicKey: vapidKeys.publicKey,
        privateKey: vapidKeys.privateKey
    }
};
// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Graceful shutdown for RabbitMQ connection
process.on('SIGINT', () => {
    if (connection) {
        connection.close(() => {
            console.log('RabbitMQ connection closed');
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
// Connect to RabbitMQ
let channel;
let connection;
callback_api_1.default.connect('amqp://localhost', (err, conn) => {
    if (err) {
        console.error("Failed to connect to RabbitMQ", err);
        return;
    }
    connection = conn;
    conn.createChannel((err1, ch) => {
        if (err1) {
            console.error("Failed to create a channel", err1);
            return;
        }
        channel = ch;
        const queue = 'push_notifications';
        ch.assertQueue(queue, { durable: true });
        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);
        // When a message is received, send a push notification
        ch.consume(queue, (msg) => {
            if (!msg) {
                console.log("No message received");
                return;
            }
            const notification = JSON.parse(msg.content.toString());
            console.log("Received a notification message:", notification);
            // Push Notification Payload
            const payload = JSON.stringify({
                title: notification.title,
                body: notification.body,
                icon: notification.icon
            });
            // Send the push notification
            const subscription = notification.subscription; // Subscription should be part of the message
            web_push_1.default.sendNotification(subscription, payload)
                .then(() => {
                console.log("Push notification sent successfully!");
                channel.ack(msg);
            })
                .catch(error => {
                console.error("Error sending notification:", error);
                channel.nack(msg);
            });
        });
    });
});
// Subscribe to push notifications (POST request)
app.post('/api/v1/subscribe', (req, res) => {
    const subscription = req.body; // The subscription object from the client
    // Send a success response to the client
    res.status(201).json({ message: 'Subscription successful' });
    // Here, we would push the notification to the RabbitMQ queue
    const notification = {
        title: 'Test Notification',
        body: 'This is a test push notification.',
        icon: 'https://example.com/icon.png',
        subscription: subscription // We save the subscription so we can notify the client later
    };
    // Publish message to the RabbitMQ queue
    channel.sendToQueue('push_notifications', Buffer.from(JSON.stringify(notification)), { persistent: true });
});
// Fetch notifications (GET Request)
app.route("/api/v1/notifications").post((req, res) => {
    var notification = req.body;
    res.status(200).json(notification);
});
// Endpoint to return the VAPID public key for the client to use
app.get('/vapidPublicKey', (req, res) => {
    res.send(vapidKeys.publicKey);
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
