const express = require('express')
const app = express()
const { getAllSprints, createSprint, deleteSprint, editSprint, getToken } = require('./logic')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  next()
})

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

app.post('/sprints', async (req, res) => {
  let token = req.body.token
  if (!token) {
    const { username, password } = req.body
    token = await getToken(username, password)
  }
  const projectID = req.body.projectID
  if (!projectID) {
    return res.status(500).json({ error: 'Project ID is not sent in request body.', success: false })
  }
  try {
    const sprints = await getAllSprints(token, projectID)
    res.status(200).send({ sprints, success: true })
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sprints.', success: false })
  }
})

// app.get('/sprintByID/:sprintId', async (req, res) => {
//   let token = req.body.token
//   if (!token) {
//     const { username, password } = req.body
//     token = await getToken(username, password)
//   }
//   const { sprintId } = req.params
//   try {
//     const sprints = await getSprintById(token, sprintId)
//     res.status(200).send({ sprints, success: true })
//   } catch (error) {
//     res.status(500).json({ error: 'Error retrieving sprint', success: false })
//   }
// })

async function getSprintByName (sprintName, token, projectID) {
  try {
    const sprints = await getAllSprints(token, projectID)
    const foundSprint = sprints.find(sprint => sprint.name === sprintName)
    if (foundSprint) {
      return { sprint: foundSprint, success: true }
    } else {
      return {
        error: 'No Sprint By This Name: ' + sprintName,
        success: false
      }
    }
  } catch (error) {
    return error
  }
};

app.post('/sprintByName', async (req, res) => {
  let token = req.body.token
  if (!token) {
    const { username, password } = req.body
    token = await getToken(username, password)
  }
  const { sprintName, projectID } = req.body
  try {
    // eslint-disable-next-line no-undef
    sprint = await getSprintByName(sprintName, token, projectID)
    // eslint-disable-next-line no-undef
    if (sprint.success) {
      // eslint-disable-next-line no-undef
      res.status(200).send(sprint)
    } else {
      // eslint-disable-next-line no-undef
      res.status(500).send(sprint)
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sprint', success: false })
  }
})

app.patch('/editSprintByName', async (req, res) => {
  let token = req.body.token
  if (!token) {
    const { username, password } = req.body
    token = await getToken(username, password)
  }
  const patch = req.body.patch
  const projectID = req.body.projectID
  const sprintName = req.body.sprintName
  const sprint = await getSprintByName(sprintName, token, projectID)
  if (sprint.success) {
    const sprintId = sprint.sprint.id
    try {
      const editedSprint = await editSprint(token, sprintId, patch)
      res.status(201).json(editedSprint)
    } catch (error) {
      res.status(500).json({ error: 'Error editing sprint' })
    }
  } else {
    res.status(500).json({ error: 'Error editing sprint' })
  }
})

app.post('/deleteSprintByName', async (req, res) => {
  let token = req.body.token
  if (!token) {
    const { username, password } = req.body
    token = await getToken(username, password)
  }
  const projectID = req.body.projectID
  const sprintName = req.body.sprintName
  const sprint = await getSprintByName(sprintName, token, projectID)
  if (sprint.success) {
    const sprintId = sprint.sprint.id
    try {
      const status = await deleteSprint(token, sprintId)
      const ack = {
        sprintID: sprintId,
        status: 'Deleted Successfully',
        TaigaAPIResponseStatus: status
      }
      res.status(201).send(ack)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(500).json({ error: sprint.error })
  }
})

app.post('/createSprint', async (req, res) => {
  let token = req.body.token
  if (!token) {
    const { username, password } = req.body
    token = await getToken(username, password)
  }
  const sprint = req.body.sprint
  try {
    const createdSprint = await createSprint(token, sprint)
    res.status(201).json(createdSprint)
  } catch (error) {
    res.status(500).json({ error: 'Error creating sprint' })
  }
})

// app.patch('/editSprint/:sprintId', async (req, res) => {
//   let token = req.body.token
//   if (!token) {
//     const { username, password } = req.body
//     token = await getToken(username, password)
//   }
//   const sprintId = req.params.sprintId
//   const patch = req.body.patch
//   try {
//     const editedSprint = await editSprint(token, sprintId, patch)
//     res.status(201).json(editedSprint)
//   } catch (error) {
//     res.status(500).json({ error: 'Error editing sprint' })
//   }
// })

// app.delete('/deleteSprint/:sprintId', async (req, res) => {
//   let token = req.body.token
//   if (!token) {
//     const { username, password } = req.body
//     token = await getToken(username, password)
//   }
//   const sprintId = req.params.sprintId
//   try {
//     const status = await deleteSprint(token, sprintId)
//     const ack = {
//       sprintID: sprintId,
//       status: 'Deleted Successfully',
//       TaigaAPIResponseStatus: status
//     }
//     res.status(201).send(ack)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

const port = 3010
// Start the server
app.listen(port, () => {
  console.log(
    `Sprint microservice running at http://localhost:${port}`
  )
})

module.exports = app
