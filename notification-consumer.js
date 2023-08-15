const AWS = require('aws-sdk');

AWS.config.update({ region: 'your-region' }); // Update with your AWS region

const sqs = new AWS.SQS();

const notificationQueueUrl = 'your-notification-queue-url'; // Replace with your SQS NotificationQueue URL

const sendNotification = async (notification) => {
    // Simulate sending a notification (email or SMS)
    console.log('Sending notification:', notification.orderId, 'Tracking:', notification.trackingInfo);
  
    const deleteParams = {
      QueueUrl: notificationQueueUrl,
      ReceiptHandle: notification.ReceiptHandle
    };
  
    try {
      await sqs.deleteMessage(deleteParams).promise();
      console.log('Notification message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  
const receiveNotificationMessages = async () => {
    const params = {
      QueueUrl: notificationQueueUrl,
      MaxNumberOfMessages: 10 // Number of messages to retrieve at once
    };
  
    try {
      const data = await sqs.receiveMessage(params).promise();
  
      if (data.Messages) {
        for (const message of data.Messages) {
          const notification = JSON.parse(message.Body);
          await sendNotification(notification);
        }
      } else {
        console.log('No messages available');
      }
    } catch (error) {
      console.error('Error receiving messages:', error);
    }
  };
  

// Poll for new notification messages every few seconds
setInterval(receiveNotificationMessages, 3000);
