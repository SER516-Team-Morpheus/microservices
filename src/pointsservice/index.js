const express = require('express')
const { getToken, getProjectData, getPointsData } = require('./logic')

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

  //   const memberData = await getMember(token)
  //   if (!memberData.success) {
  //     return res.status(404).send(memberData)
  //   }
  //   const memberId = memberData.memberId
  //   const getProjectData = await getProjectList(token, memberId)
  //   if (!getProjectData.success) {
  //     return res.status(404).send(getProjectData)
  //   }
  //   return res.send(getProjectData)
})

// Start the server
app.listen(port, () => {
  console.log(`Points microservice running at http://localhost:${port}`)
})

module.exports = app
