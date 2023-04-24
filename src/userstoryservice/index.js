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
  deleteUserStory,
  moveUserStory
} = require('./logic')

const app = express()
const port = 3066

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


// Endpoint for moving user story to sprint 
app.post('/moveUserStory', async (req, res) => {
  const { username, password, projectId, sprintId, userStoryID } = req.body
  const token = await getToken(username, password)
  const moveUserStoryData = await moveUserStory(token, projectId, sprintId, userStoryID)
  if (moveUserStoryData.success) {
    return res.status(201).send(moveUserStoryData)
  } else {
    return res.status(500).send(moveUserStoryData)
  }
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
    const pointsValue = {}
    if (req.body.points !== undefined) {
      const rolelist = await getRoleId(token, projectId)
      if (!rolelist.success) {
        console.log('Error getting roles')
      }
      const roles = rolelist.roleIds
      const userpointList = await getPointValues(token, projectId)
      if (!userpointList.success) {
        console.log('Error getting userpoints')
      }
      const points = userpointList.pointValues
      for (const key in req.body.points) {
        const newKey = roles[key]
        const value = req.body.points[key]
        pointsValue[newKey] = points[value]
      }
      parameters.points = pointsValue
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

app.delete('/deleteUserstory', async (req, res) => {
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
    const userstoryDelResponse = await deleteUserStory(token, userstoryId)
    if (!userstoryDelResponse.success) {
      return res.status(500).send({
        userstoryDelResponse
      })
    }
    return res.status(201).send(userstoryDelResponse)
  }
})
// Start the server
app.listen(port, () => {
  console.log(`User story microservice running at http://localhost:${port}`)
})

module.exports = app
