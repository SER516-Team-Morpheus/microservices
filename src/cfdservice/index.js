/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
const express = require('express')
const {
  getHeaders, getToken, getTaskStatuses, getProject, getTasks, getTasksHistory, getTaskStatus
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

async function getEmptyStatusMatrix (ID, userName, password) {
  token = await getToken(userName, password)
  headers = getHeaders(token.token)
  res = await getProject(headers, ID)
  if (res.success) {
    project = res.project
    return { project, statuses: await getTaskStatuses(headers, project.id), success: true }
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
  const { projectId } = req.body
  if (!projectId) {
    return res.status(500).send({
      error: 'Project ID not sent in body.'
    })
  }
  const cfd = {}
  const statusData = await getEmptyStatusMatrix(projectId, userName, password)
  if (statusData.success) {
    slug = statusData.project.slug
    emptyStatusMatrix = statusData.statuses

    // loop through each date between the start and end dates and add it to the list
    // eslint-disable-next-line no-unmodified-loop-condition
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      cfd[date] = { ...emptyStatusMatrix }
    }

    const tasks = await getTasks(headers, slug)
    const promises = tasks.map(task => getTasksHistory(headers, task.id))
    const taskHistories = await Promise.all(promises)
    const taskHistoryObject = {}
    for (let i = 0; i < tasks.length; i++) {
      taskHistoryObject[tasks[i].id] = {
        task_data: tasks[i],
        task_history: taskHistories[i]
      }
    }
    try {
      for (const [, data] of Object.entries(taskHistoryObject)) {
        task = data.task_data
        let taskHistory = data.task_history
        taskHistory = taskHistory.filter(
          (obj) => obj.values_diff && obj.values_diff.status
        )
        const createdDate = new Date(task.created_date)

        let reducedObjects = taskHistory.reduce((acc, curr) => {
          const currDate = new Date(curr.created_at).toLocaleDateString()
          const accDate = acc[currDate]
            ? new Date(acc[currDate].created_at)
            : null
          const currDateTime = new Date(curr.created_at)

          // If there's no object for this date, or this object is newer than the existing one, replace it
          if (!acc[currDate] || currDateTime > accDate) {
            acc[currDate] = curr
          }

          return acc
        }, {})
        reducedObjects = Object.values(reducedObjects)
        for (const [key, value] of Object.entries(cfd)) {
          const status = getTaskStatus(
            reducedObjects,
            new Date(key),
            createdDate
          )
          if (status) {
            value[status] += 1
          }
        }
      }
      const labels = Object.keys(cfd).map((date) =>
        new Date(date).toDateString()
      )
      const statusNames = Object.keys(cfd[Object.keys(cfd)[1]])
      const datasets = statusNames.map((statusName, i) => ({
        key: statusName,
        value: Object.keys(cfd).map((date) => cfd[date][statusName])
      }))
      const returnCFD = {
        dates: labels,
        status: datasets
      }
      return res.status(200).send(returnCFD)
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
