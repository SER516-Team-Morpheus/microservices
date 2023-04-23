/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
const express = require('express')
const {
  getHeaders,
  getToken,
  getSprintStates
} = require('./logic')
const app = express()
const port = 3020

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

// Endpoint for getting user stories details
app.post('/sb', async (req, res) => {
  try {
    const userName = req.body.username
    const password = req.body.password
    let token = req.body.token
    if (!token) {
      const tokenResponse = await getToken(userName, password)
      token = tokenResponse.token
      if (!token) {
        return res.status(404).send({
          error: tokenResponse.error
        })
      }
    }
    const { sprintID } = req.body
    if (!sprintID) {
      return res.status(500).send({
        error: 'Sprint ID not send in request Body'
      })
    }
    const headers = getHeaders(token)
    const stats = await getSprintStates(headers, sprintID)
    if (stats.success) {
      const daysStats = stats.data.days
      const dayLabels = daysStats.map((day) => day.day)
      const openPoints = daysStats.map((day) =>
        parseFloat(day.open_points.toFixed(2))
      )
      const optimalPoints = daysStats.map((day) =>
        parseFloat(day.optimal_points.toFixed(2))
      )
      let AUC = 0
      for (let i = 0; i < dayLabels.length; i++) {
        AUC += Math.abs(openPoints[i] - optimalPoints[i])
      }
      AUC = AUC.toFixed(2)
      const completedTasks = stats.data.completed_tasks
      const completedUS = stats.data.completed_userstories
      const totalTasks = stats.data.total_tasks
      const totalUS = stats.data.total_userstories
      const { name } = stats.data

      return res.status(200).send({
        dayLabels,
        openPoints,
        optimalPoints,
        AUC,
        completedTasks,
        completedUS,
        totalTasks,
        totalUS,
        name
      })
    } else {
      return res.status(500).send({
        error: stats.message
      })
    }
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})
// Start the server
app.listen(port, () => {
  console.log(`Sprint Burndown Chart Microservice running at http://localhost:${port}`)
})

module.exports = { app }
