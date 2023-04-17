/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
const express = require('express')
const {
  getHeaders, getToken, getTaskStatuses, getProjectID, getTasks, getTasksHistory, getTaskStatus
} = require('./logic')
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

async function getEmptyStatusMatrix (slug, userName, password) {
  token = await getToken(userName, password)
  headers = getHeaders(token.token)
  res = await getProjectID(headers, slug)
  if (res.success) {
    return { statuses: await getTaskStatuses(headers, res.projectId), success: true }
  } else {
    return { error: 'Error Finding Project', success: false }
  }
}

// Endpoint for getting user stories details
app.post('/cfd', async (req, res) => {
  const userName = req.body.username
  const password = req.body.password
  const today = new Date()
  const oneDay = 24 * 60 * 60 * 1000
  const endDate = new Date(today.getTime())
  const sevenDays = 6 * oneDay
  const startDate = new Date(today.getTime() - sevenDays)
  let { projectName } = req.body
  if (!projectName) {
    return res.status(500).send({
      error: 'Project name not sent in body.'
    })
  }
  projectName = projectName.replace(/\s+/g, '-')
  const slug = `${userName.toLowerCase()}-${projectName.toLowerCase()}`
  const cfd = {}
  const statusData = await getEmptyStatusMatrix(slug, userName, password)
  if (statusData.success) {
    emptyStatusMatrix = statusData.statuses

    // loop through each date between the start and end dates and add it to the list
    // eslint-disable-next-line no-unmodified-loop-condition
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      cfd[date] = { ...emptyStatusMatrix }
    }

    const tasks = await getTasks(headers, slug)
    try {
      for (const task of tasks) {
        let taskHistory = await getTasksHistory(headers, task.id)
        taskHistory = taskHistory.filter(obj => obj.values_diff && obj.values_diff.status)
        const createdDate = new Date(task.created_date)

        let reducedObjects = taskHistory.reduce((acc, curr) => {
          const currDate = new Date(curr.created_at).toLocaleDateString()
          const accDate = acc[currDate] ? new Date(acc[currDate].created_at) : null
          const currDateTime = new Date(curr.created_at)

          // If there's no object for this date, or this object is newer than the existing one, replace it
          if (!acc[currDate] || currDateTime > accDate) {
            acc[currDate] = curr
          }

          return acc
        }, {})
        reducedObjects = Object.values(reducedObjects)
        for (const [key, value] of Object.entries(cfd)) {
          const status = getTaskStatus(reducedObjects, new Date(key), createdDate)
          if (status) {
            value[status] += 1
          }
        }
      }
      return res.status(200).send(cfd)
    } catch (err) {
      return res.status(500).send({ error: 'Error occured while calculating CFD MATRIX' })
    }
  } else {
    return res.status(500).send({ error: 'Project Not Found' })
  }
})
// Start the server
app.listen(port, () => {
  console.log(`CFD Microservice running at http://localhost:${port}`)
})

module.exports = { app, getEmptyStatusMatrix }
