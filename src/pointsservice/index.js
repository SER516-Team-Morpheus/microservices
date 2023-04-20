const express = require('express')
const {
  getToken,
  getProjectData,
  getPointsData,
  createPointsData
} = require('./logic')

const app = express()
const port = 3007

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

// Endpoint for getting project under a member account
app.get('/getPoints', async (req, res) => {
  const { username, password, projectName } = req.query
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectName.toLowerCase()}`
  const projectData = await getProjectData(token, slugName)
  if (!projectData.success) {
    return res.status(404).send(projectData)
  }
  const projectId = projectData.projectId
  const pointsData = await getPointsData(token, projectId)
  if (!pointsData.success) {
    return res.status(404).send(pointsData)
  }
  return res.status(200).send(pointsData)
})

app.post('/createPoints', async (req, res) => {
  const { username, password, projectName, value } = req.body
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectName.toLowerCase()}`
  const projectData = await getProjectData(token, slugName)
  if (!projectData.success) {
    return res.status(404).send(projectData)
  }
  const projectId = projectData.projectId
  const getPoints = await getPointsData(token, projectId)
  const data = getPoints.data
  for (const point of data) {
    if (point.value === value) {
      return res.status(409).send({
        success: false,
        message: 'Value already exists'
      })
    }
  }
  const pointsData = await createPointsData(token, projectId, value)
  if (!pointsData.success) {
    return res.status(404).send(pointsData)
  }
  return res.status(201).send(pointsData)
})


// Endpoint for deleting a member
app.delete('/deletePointsData/:id', async (req, res) => {
  const { token, projectId} = req.body
  //const memberId = req.params.id
  const memberData = await deletePointsData(token, projectId)
  if (!memberData.success) {
    return res.status(500).send({
      success: false,
      message: 'Error deleting points data'
    })
  }


// Start the server
app.listen(port, () => {
  console.log(`Points microservice running at http://localhost:${port}`)
})

module.exports = app
