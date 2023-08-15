const AWS = require('aws-sdk');

AWS.config.update({ region: 'your-region' }); // Update with your AWS region

const sqs = new AWS.SQS();

const orderQueueUrl = 'your-order-queue-url'; // Replace with your SQS OrderQueue URL

const processOrder = async (order) => {
    // Simulate processing order and shipping
    console.log('Processing order:', order.orderId);
  
    try {
      const notificationQueueUrl = 'your-notification-queue-url'; // Replace with your SQS NotificationQueue URL
      const notificationMessage = {
        MessageBody: JSON.stringify({ orderId: order.orderId, trackingInfo: '123456789' })
      };
  
      const result = await sqs.sendMessage({ QueueUrl: notificationQueueUrl, ...notificationMessage });
      console.log('Notification message sent:', result.MessageId);
    } catch (error) {
      console.error('Error sending notification message:', error);
    }
  };
  

const receiveOrderMessages = async () => {
    const params = {
      QueueUrl: orderQueueUrl,
      MaxNumberOfMessages: 10 // Number of messages to retrieve at once
    };
  
    try {
      const data = await sqs.receiveMessage(params);
  
      if (data.Messages) {
        for (const message of data.Messages) {
          const order = JSON.parse(message.Body);
          processOrder(order);
  
          const deleteParams = {
            QueueUrl: orderQueueUrl,
            ReceiptHandle: message.ReceiptHandle
          };
  
          try {
            await sqs.deleteMessage(deleteParams).promise();
            console.log('Order message deleted');
          } catch (deleteError) {
            console.error('Error deleting message:', deleteError);
          }
        }
      } else {
        console.log('No messages available');
      }
    } catch (error) {
      console.error('Error receiving messages:', error);
    }
  };
  

// Poll for new order messages every few seconds
setInterval(receiveOrderMessages, 3000);
