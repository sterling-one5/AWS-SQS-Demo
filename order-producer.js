const AWS = require('aws-sdk');

AWS.config.update({ region: 'your-region' }); // Update with your AWS region

const sqs = new AWS.SQS();

const orderDetails = {
  orderId: '12345',
  items: ['item1', 'item2'],
  shippingAddress: '123 Main St'
};

const orderQueueUrl = 'your-order-queue-url'; // Replace with your SQS OrderQueue URL

const orderMessage = {
  MessageBody: JSON.stringify(orderDetails)
};

const sendOrderMessage = async () => {
  try {
    const result = await sqs.sendMessage({ QueueUrl: orderQueueUrl, ...orderMessage });
    console.log('Order message sent:', result.MessageId);
  } catch (error) {
    console.error('Error sending order message:', error);
  }
};

sendOrderMessage();
