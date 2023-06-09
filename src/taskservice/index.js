const express = require('express')
// const { createTask } = require("./logic");
// const { getUserStoryDetails } = require("./logic");
const {
  getToken, getTaskDetails, getUserStoryDetails, createTask, updateTaskDetails, deleteTask,
  getUserStoryTasksDetails, getTaskStatusCode
} = require('./logic')

const app = express()

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

// Endpoint for creating a new task
app.post('/createTask', async (req, res) => {
  const { username } = req.body
  const { password } = req.body
  const { projectname } = req.body
  const { userstoryname } = req.body
  const subject = req.body.taskname

  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectname.toLowerCase()}`
  const userstoryDetails = await getUserStoryDetails(token, slugName, userstoryname)
  if (userstoryDetails.success === false) {
    return res.status(500).send({ message: 'Error in getting user story details' })
  }
  const taskData = await createTask(
    userstoryDetails.parameters.projectid,
    userstoryDetails.parameters.id,
    subject,
    // eslint-disable-next-line function-paren-newline
    token)
  if (!taskData.success) {
    return res.status(500).send({
      taskData
    })
  }
  return res.status(201).send(taskData)
})

app.post('/updateTask', async (req, res) => {
  const {
    username, password, projectname, userstoryname, taskname
  } = req.body
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectname.toLowerCase()}`
  const taskDetails = await getTaskDetails(token, slugName, userstoryname, taskname)
  if (!taskDetails.success) {
    return res.status(500).send({
      taskDetails
    })
  }
  const projectid = taskDetails.parameters.projectid
  const taskId = taskDetails.parameters.id
  const parameters = {}
  if (req.body.status !== undefined) {
    const status = await getTaskStatusCode(token, projectid)
    console.log(status)
    parameters.status = status.taskIds[req.body.status.toLowerCase()]
  }
  if (req.body.description !== undefined) {
    parameters.description = req.body.description
  }
  if (req.body.assigned_to !== undefined) {
    parameters.assigned_to = req.body.assigned_to
  }
  parameters.version = taskDetails.parameters.version
  const taskUpdateData = await updateTaskDetails(token, taskId, parameters)
  if (!taskUpdateData.success) {
    return res.status(500).send({
      taskUpdateData
    })
  }
  return res.status(201).send(taskUpdateData)
})

app.delete('/deleteTask', async (req, res) => {
  const {
    username, password, projectname, userstoryname, taskname
  } = req.body
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectname.toLowerCase()}`
  const taskDetails = await getTaskDetails(token, slugName, userstoryname, taskname)
  if (!taskDetails.success) {
    return res.status(500).send({
      taskDetails
    })
  }
  const taskId = taskDetails.parameters.id

  const taskDeleteData = await deleteTask(token, taskId)
  if (!taskDeleteData.success) {
    return res.status(500).send({
      taskDeleteData
    })
  }
  return res.status(201).send(taskDeleteData)
})

app.get('/getTaskDetails', async (req, res) => {
  const {
    username, password, projectname, userstoryname, taskname
  } = req.body
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectname.toLowerCase()}`
  const taskDetails = await getTaskDetails(token, slugName, userstoryname, taskname)
  if (!taskDetails.success) {
    return res.status(500).send({
      taskDetails
    })
  }
  return res.status(201).send(taskDetails)
})

app.post('/getUserStoryTaskDetails', async (req, res) => {
  const {
    username, password, projectname, userstoryname
  } = req.body
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectname.toLowerCase()}`
  const userStoryTasksDetails = await getUserStoryTasksDetails(token, slugName, userstoryname)
  if (!userStoryTasksDetails.success) {
    return res.status(500).send({
      userStoryTasksDetails
    })
  }
  return res.status(201).send(userStoryTasksDetails)
})

const port = 3005
// Start the server
app.listen(port, () => {
  console.log(`Task microservice running at http://localhost:${port}`)
})
module.exports = app
