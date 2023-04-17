const express = require('express')
const {
  getProjectBySlug,
  getToken,
  createUserstory,
  updateUserstory,
  getUserStoryDetails,
  getUserStory,
  getPointValues,
  getRoleId,
} = require('./logic')

const app = express()
const port = 3003

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

// Endpoint for creating a new user story
app.post('/createUserstory', async (req, res) => {
  const { username, password, projectName, subject } = req.body
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectName.toLowerCase()}`
  const projectData = await getProjectBySlug(token, slugName)
  if (!projectData.success) {
    return res.status(500).send(projectData)
  }
  const projectId = projectData.projectId
  const userstoryData = await createUserstory(projectId, subject, token)
  if (userstoryData.success) {
    return res.status(201).send(userstoryData)
  } else {
    return res.status(500).send(userstoryData)
  }
})

// Endpoint for getting user stories details
app.get('/getUserStoryDetails', async (req, res) => {
  const { username, password, projectname, userstoryname } = req.body
  const token = await getToken(username, password)
  const slugName = username.toLowerCase() + '-' + projectname.toLowerCase()
  const userstoryDetails = await getUserStoryDetails(
    token,
    slugName,
    userstoryname
  )
  if (!userstoryDetails.success) {
    return res.status(500).send({
      userstoryDetails
    })
  }
  return res.status(200).send(userstoryDetails)
})

// Endpoint for getting all user stories for a project
app.get('/getUserStory', async (req, res) => {
  const { username, password, projectName } = req.query
  const token = await getToken(username, password)
  const slugName = username.toLowerCase() + '-' + projectName.toLowerCase()
  const projectData = await getProjectBySlug(token, slugName)
  if (!projectData.success) {
    return res.status(500).send(projectData)
  }
  const userstoryData = await getUserStory(token, projectData.projectId)
  if (!userstoryData.success) {
    return res.status(500).send(userstoryData)
  }
  return res.status(200).send(userstoryData)
})

// Endpoint for updating a user story
app.patch('/updateUserstory', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const projectname = req.body.projectname
  const userstoryname = req.body.userstoryname
  const token = await getToken(username, password)
  const slugName = username.toLowerCase() + '-' + projectname.toLowerCase()
  const userstoryDetails = await getUserStoryDetails(
    token,
    slugName,
    userstoryname
  )
  if (!userstoryDetails.success) {
    return res.status(500).send({
      userstoryDetails
    })
  } else {
    const userstoryId = userstoryDetails.parameters.id
    const version = userstoryDetails.parameters.version
    const projectId = userstoryDetails.parameters.projectId
    // const point = userstoryDetails.parameters.point
    const parameters = {}
    if (req.body.description !== undefined) {
      parameters.description = req.body.description
    }
    if (req.body.assigned_to !== undefined) {
      parameters.assigned_to = req.body.assigned_to
    }
    if (req.body.is_closed !== undefined) {
      parameters.is_closed = req.body.is_closed
    }
    if (req.body.tags !== undefined) {
      parameters.tags = req.body.tags
    }
    const points = {}
    if (req.body.points !== undefined) {
      const rolelist = await getRoleId(token, projectId)
      if (!rolelist.success) {
        console.log('Error getting roles')
      }
      const roles = rolelist.roleIds
      const userpoint = {
        '?': 0,
        0: 1,
        '1/2': 2,
        1: 3,
        2: 4,
        3: 5,
        5: 6,
        8: 7,
        10: 8,
        13: 9,
        20: 10,
        40: 11
      }

      const pointDetails = await getPointValues(token, projectId)
      const point = pointDetails.point_value
      for (const key in req.body.points) {
        const value = req.body.points[key]
        const newKey = roles[key]
        const newValue = userpoint[value]
        points[newKey] = point + newValue
      }

      parameters.points = points
    }
    parameters.version = version

    const userstoryData = await updateUserstory(userstoryId, parameters, token)
    if (!userstoryData.success) {
      return res.status(500).send({
        userstoryData
      })
    }
    return res.status(201).send(userstoryData)
  }
})

// Start the server
app.listen(port, () => {
  console.log(`User story microservice running at http://localhost:${port}`)
})

module.exports = app
