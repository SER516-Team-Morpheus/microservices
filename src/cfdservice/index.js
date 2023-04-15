const express = require('express');
const bodyParser = require('body-parser');
const { fetchData } = require('./logic');

const app = express()
const port = 3012

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    next()
})

// Endpoint to fetch data from DynamoDB
app.get('/data', async (req, res) => {
  const { startDate, endDate } = req.query;
  const params = {
    TableName: 'myTable',
    KeyConditionExpression: 'date BETWEEN :startDate AND :endDate',
    ExpressionAttributeValues: {
      ':startDate': { S: startDate },
      ':endDate': { S: endDate },
    },
  };
  const data = await fetchData(params);
  res.json(data);
});

// Start the server
app.listen(port, () => {
    console.log(
        `Create cfd microservice running at http://localhost:${port}`
    )
  })
  
module.exports = app
