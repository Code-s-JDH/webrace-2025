import express from 'express';
import webPush from 'web-push';
import bodyParser from 'body-parser';
import cors from 'cors';
import amqp from 'amqplib/callback_api';

const app = express();
const port = 3100;

app.use(bodyParser.json());
app.use(cors());

// Your VAPID keys, which you'll use to authenticate your server
const vapidKeys = webPush.generateVAPIDKeys();

// Set up VAPID details
webPush.setVapidDetails(
    'mailto:example@yourdomain.com',  // Email for VAPID details
    vapidKeys.publicKey,  // Public key
    vapidKeys.privateKey  // Private key
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
    } else {
        process.exit(0);
    }
});

// Connect to RabbitMQ
let channel: amqp.Channel;
let connection: amqp.Connection;
amqp.connect('amqp://localhost', (err, conn) => {
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
            webPush.sendNotification(subscription, payload)
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

// Example data for notifications (you may replace this with a database in production)
interface Notification {
    title: string;
    body: string;
    icon: string;
    subscription: object;  // The subscription object from the client
}

// Subscribe to push notifications (POST request)
app.post('/api/v1/subscribe', (req, res) => {
    const subscription = req.body;  // The subscription object from the client

    // Send a success response to the client
    res.status(201).json({ message: 'Subscription successful' });

    // Here, we would push the notification to the RabbitMQ queue
    const notification = {
        title: 'Test Notification',
        body: 'This is a test push notification.',
        icon: 'https://example.com/icon.png',
        subscription: subscription  // We save the subscription so we can notify the client later
    };

    // Publish message to the RabbitMQ queue
    channel.sendToQueue('push_notifications', Buffer.from(JSON.stringify(notification)), { persistent: true });
});

// Fetch notifications (GET Request)
app.route("/api/v1/notifications").post((req, res) => {
    var notification: Notification = req.body;
    res.status(200).json(notification);
});

// Endpoint to return the VAPID public key for the client to use
app.get('/vapidPublicKey', (req, res) => {
    res.send(vapidKeys.publicKey);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
