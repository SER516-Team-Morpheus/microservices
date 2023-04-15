const AWS = require('aws-sdk');
require('dotenv').config({ path: '../.env' })

// Initialization DynamoDB client
const dynamodb = new AWS.DynamoDB();

// Function to fetch data from DynamoDB
async function fetchData(params) {
  try {
    const data = await dynamodb.query(params).promise();
    return data.Items;
  } catch (error) {
    console.log(`Error fetching data from DynamoDB: ${error}`);
    return [];
  }
}

module.exports = { fetchData };
