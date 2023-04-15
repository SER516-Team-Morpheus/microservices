const express = require('express')
const AWS = require('aws-sdk')
const {
    fetchData, getHeaders, getToken, getTaskStatuses, getProjectID
} = require('./logic')
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" })
const app = express()
const port = 3012

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
})

function queryDynamoDB(params) {
    return new Promise((resolve, reject) => {
        dynamodb.query(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.Items);
            }
        });
    });
}

async function getEmptyStatusMatrix(slug){
    token = await getToken()
    headers = getHeaders(token.token)
    res = await getProjectID(headers, slug)
    if (res.success){
        return {statuses : await getTaskStatuses(headers, res.projectId), success: true}
    } else {
        return {error: "Error Finding Project", success: false}
    }
}

// Endpoint for getting user stories details
app.get('/cfd', async (req, res) => {
    const userName = 'sertestuser';
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const endDate = new Date(today.getTime());
    const sevenDays = 6 * oneDay;
    const startDate = new Date(today.getTime() - sevenDays);
    const { projectName} = req.body
    const slug = `${userName.toLowerCase()}-${projectName.toLowerCase()}`
    const dateList = [];
    const cfdDataList = {};
    const cfd = { project:projectName };
    const statusData = await getEmptyStatusMatrix(slug)
    if (statusData.success){
        emptyStatusMatrix = statusData.statuses

    // loop through each date between the start and end dates and add it to the list
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        dateList.push(date.toISOString().slice(0, 10));
    }

    // create an array of Promises for each date in the dateList
    const promises = dateList.map(date => {
        let key = date + ';' + slug
        const params = {
            TableName: 'ser516-cfd-data',
            KeyConditionExpression: 'recordKey = :key',
            ExpressionAttributeValues: {
                ':key': key
            }
        }
        return queryDynamoDB(params)
            .then(data => {
                cfdDataList[key] = data;
                // code to execute after the data is fetched
            })
            .catch(err => {
                console.error(err);
            });
    });

    // wait for all Promises to complete
    Promise.all(promises)
        .then(() => {
            // execute this code after all Promises are resolved
            
            Object.entries(cfdDataList).forEach(function ([ key, value]) {
                const stringArray = key.split(';');
                const date = stringArray[0]; 
                if (Object.keys(value).length != 0) {
                    delete value[0].recordKey
                    cfd[date] = value[0]
                } else {
                    cfd[date] = emptyStatusMatrix
                }
            });
            return res.status(200).send(cfd)
        })
        .catch(err => {
            console.error(err);
        });
    } else {
        return res.status(500).send({error: 'Project Not Found'})
    }
})
// Start the server
app.listen(port, () => {
    console.log(`CFD Microservice running at http://localhost:${port}`)
})

module.exports = { app, getEmptyStatusMatrix }



