// Load AWS SDK
const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize AWS services
const lambda = new AWS.Lambda();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Set up the Express app
const app = express();
app.use(bodyParser.json());

// Define your port
const PORT = process.env.PORT || 3000;

// API Gateway endpoint for unlocking a door
app.post('/unlock', async (req, res) => {
    const { deviceId, userId } = req.body;
    try {
        // Call Lambda function which interacts with IoT device
        const params = {
            FunctionName: 'UnlockDoorFunction',
            Payload: JSON.stringify({ deviceId, userId })
        };
        const response = await lambda.invoke(params).promise();
        res.status(200).send(JSON.parse(response.Payload));
    } catch (error) {
        console.error('Error unlocking the door:', error);
        res.status(500).send('Failed to unlock the door.');
    }
});

// Lambda function to create an IoT communication
const unlockDoor = async (event) => {
    console.log('Unlocking door for:', event);
    // Implement your IoT unlock logic here
    // This is where you'd call AWS IoT SDK or simulate unlocking logic
    return { message: 'Door successfully unlocked!', deviceId: event.deviceId };
};

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

exports.handler = unlockDoor;
