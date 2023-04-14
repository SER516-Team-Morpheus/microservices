const express = require('express')
const { getToken, createEpic, listEpics, getEpic, editEpic, deleteEpic, createBulkEpics, getFiltersData, listRelatedUserStories, addRelatedUserStory, getRelatedUserStory, editRelatedUserStory, deleteRelatedUserStory, bulkCreateRelatedUserStories } = require('./logic')

const app = express()
const port = 3006

app.use(express.json())

// Start the server
app.listen(port, () => {
  console.log(
    `Create Epic microservice running at http://localhost:${port}`
  )
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

// Endpoint for creating a new epic
// 14.2. Create
// To create epics send a POST request with the following data:
// assigned_to: user id
// blocked_note: reason why the epic is blocked
// description: string
// is_blocked: boolean
// is_closed: boolean
// color: HEX color
// project (required): project id
// subject (required)
// tags: array of strings
// watchers: array of watcher id’s
// curl -X POST \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -d '{
//         "assigned_to": null,
//         "blocked_note": "blocking reason",
//         "client_requirement": false,
//         "color": "#ABCABC",
//         "description": "New epic description",
//         "epics_order": 2,
//         "is_blocked": true,
//         "project": 1,
//         "status": 2,
//         "subject": "New epic",
//         "tags": [
//             "service catalog",
//             "customer"
//         ],
//         "team_requirement": false,
//         "watchers": []
//     }' \
// -s http://localhost:8000/api/v1/epics
// curl -X POST \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -d '{
//         "project": 1,
//         "subject": "New epic"
//     }' \
// -s http://localhost:8000/api/v1/epics
// When the creation is successful, the HTTP response is a 201 Created and the response body is a JSON epic detail object
app.post('/createEpic', async (req, res) => {
  const { username, password, projectId, name, description } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicData = await createEpic(name, projectId, description, token)
  if (!epicData.success) {
    return res.status(500).send(epicData)
  }
  return res.status(201).send(epicData)
})

// Endpoint for listing epics
// 14.3. Get
// To get an epic send a GET request specifying the epic id in the url
// curl -X GET \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -s http://localhost:8000/api/v1/epics/1
// The HTTP response is a 200 OK and the response body is a JSON epic detail (GET) object
// The results can be filtered using the following parameters:
// project: project id
// project__slug: project slug
// assigned_to: assigned to user id
// status__is_closed: boolean indicating if the epic status is closed
// curl -X GET \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -s http://localhost:8000/api/v1/epics?project=1
app.post('/listEpics', async (req, res) => {
  const { username, password, projectId, projectSlug, assignedTo, isClosed } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicList = await listEpics(token, projectId, projectSlug, assignedTo, isClosed)
  if (!epicList.success) {
    return res.status(500).send(epicList)
  }
  return res.status(200).send(epicList)
})

// Endpoint for getting epic details
// 14.3. Get
// To get an epic send a GET request specifying the epic id in the url
// curl -X GET \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -s http://localhost:8000/api/v1/epics/1
// The HTTP response is a 200 OK and the response body is a JSON epic detail (GET) object
app.post('/getEpic/', async (req, res) => {
  const { username, password, epicId } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicData = await getEpic(token, epicId)
  if (!epicData.success) {
    return res.status(500).send(epicData)
  }
  return res.status(200).send(epicData)
})

// Endpoint for editing an epic
// 14.5. Edit
// To edit epics send a PUT or a PATCH specifying the epic id in the url. In a PATCH request you just need to send the modified data, in a PUT one the whole object must be sent.
// curl -X PATCH \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -d '{
//         "subject": "Patching subject",
//         "version": 1
//     }' \
// -s http://localhost:8000/api/v1/epics/15
// When the creation is successful, the HTTP response is a 200 OK and the response body is a JSON epic detail object
app.post('/editEpic/', async (req, res) => {
  const { username, password, epicId, name, version } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicData = await editEpic(epicId, name, version, token)
  if (!epicData.success) {
    return res.status(500).send(epicData)
  }
  return res.status(200).send(epicData)
})

// Endpoint for deleting an epic
// 14.6. Delete
// To delete epics send a DELETE specifying the epic id in the url
// curl -X DELETE \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -s http://localhost:8000/api/v1/epics/15
// When delete succeeded, the HTTP response is a 204 NO CONTENT with an empty body response
app.post('/deleteEpic/', async (req, res) => {
  const { username, password, epicId } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicData = await deleteEpic(epicId, token)
  if (!epicData.success) {
    return res.status(500).send(epicData)
  }
  return res.status(204).send(epicData)
})

// Endpoint for bulk creation of epics
// 14.7. Bulk creation
// To create multiple epics at the same time send a POST request with the following data:
// project_id (required)
// status_id (optional)
// bulk_epics: epic subjects, one per line
// curl -X POST \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -d '{
//         "bulk_epics": "EPIC 1 \n EPIC 2 \n EPIC 3",
//         "project_id": 1
//     }' \
// -s http://localhost:8000/api/v1/epics/bulk_create
// When the creation is successful, the HTTP response is a 200 OK and the response body is a JSON list of epic detail object
app.post('/createBulkEpics', async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const { username, password, epics, projectId, statusId } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicData = await createBulkEpics(projectId, epics, token)
  if (!epicData.success) {
    return res.status(500).send(epicData)
  }
  return res.status(201).send(epicData)
})

// Endpoint for getting filters data
// 14.8. Filters data
// To get the epic filters data send a GET request specifying the project id in the url
// curl -X GET \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -s http://localhost:8000/api/v1/epics/filters_data?project=1
// The HTTP response is a 200 OK and the response body is a JSON epic filters data object
app.post('/filtersData', async (req, res) => {
  const { username, password, projectId } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicData = await getFiltersData(token, projectId)
  if (!epicData.success) {
    return res.status(500).send(epicData)
  }
  return res.status(200).send(epicData)
})

// Endpoint for listing related user stories
// 14.9. List related userstories
// To get the list of related user stories from an epic send a GET request specifying the epic id in the url
// curl -X GET \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -s http://localhost:8000/api/v1/epics/15/related_userstories
// The HTTP response is a 200 OK and the response body is a JSON list of epic related user story detail objects
app.post('/listRelatedUserStories/', async (req, res) => {
  const { username, password, epicId } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicData = await listRelatedUserStories(token, epicId)
  if (!epicData.success) {
    return res.status(500).send(epicData)
  }
  return res.status(200).send(epicData)
})

// Endpoint for adding related user stories
// 14.10. Create related userstory
// To create an epic related user story send a POST request with the following data:
// epic: related epic id
// user_story: related user story id
// curl -X POST \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -d '{
//         "epic": 15,
//         "user_story": 1
//     }' \
// -s http://localhost:8000/api/v1/epics/15/related_userstories
// When the creation is successful, the HTTP response is a 201 Created and the response body is a JSON epic related user story detail object
app.post('/addRelatedUserStory/', async (req, res) => {
  const { username, password, epicId, userStoryId } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicData = await addRelatedUserStory(token, epicId, userStoryId)
  if (!epicData.success) {
    return res.status(500).send(epicData)
  }
  return res.status(201).send(epicData)
})

// Endpoint for getting related user stories
// 14.11. Get related userstory
// To get a related user story from an epic send a GET request specifying the epic and user story ids in the url
// curl -X GET \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -s http://localhost:8000/api/v1/epics/15/related_userstories/2
// The HTTP response is a 200 OK and the response body is a JSON epic related user story detail object
app.post('/getRelatedUserStory/', async (req, res) => {
  const { username, password, epicId, userStoryId } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicData = await getRelatedUserStory(token, epicId, userStoryId)
  if (!epicData.success) {
    return res.status(500).send(epicData)
  }
  return res.status(200).send(epicData)
})

// Endpoint for editing related user stories
// 14.12. Edit related userstory\
// To edit epic related user stories send a PUT or a PATCH specifying the epic and user story ids in the url. In a PATCH request you just need to send the modified data, in a PUT one the whole object must be sent.
// curl -X PATCH \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -d '{
//         "order": 100
//     }' \
// -s http://localhost:8000/api/v1/epics/15/related_userstories/2
// When the creation is successful, the HTTP response is a 200 OK and the response body is a JSON epic related user story detail object
app.put('/editRelatedUserStory/', async (req, res) => {
  const { username, password, epicId, userStoryId, order } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicData = await editRelatedUserStory(token, epicId, userStoryId, order)
  if (!epicData.success) {
    return res.status(500).send(epicData)
  }
  return res.status(200).send(epicData)
})

// Endpoint for deleting related user stories
// 14.13. Delete related userstory
// To delete epic related user stories send a DELETE specifying the epic and the userstory ids in the url
// curl -X DELETE \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -s http://localhost:8000/api/v1/epics/15/related_userstories/2
// When delete succeeded, the HTTP response is a 204 NO CONTENT with an empty body response
app.delete('/deleteRelatedUserStory/', async (req, res) => {
  const { username, password, epicId, userStoryId } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicData = await deleteRelatedUserStory(token, epicId, userStoryId)
  if (!epicData.success) {
    return res.status(500).send(epicData)
  }
  return res.status(204).send(epicData)
})

// Endpoint for bulk create related user stories
// 14.14. Bulk related userstories creation
// To create multiple related user stories at the same time send a POST request with the following data:
// project_id (required)
// bulk_userstories: user stories subjects, one per line
// curl -X POST \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer ${AUTH_TOKEN}" \
// -d '{
//         "bulk_userstories": "epic 1 \n epic 2 \n epic 3",
//         "project_id": 3
//     }' \
// -s http://localhost:8000/api/v1/epics/15/related_userstories/bulk_create
// When the creation is successful, the HTTP response is a 201 OK and the response body is a JSON list of epic related user story detail object
app.post('/bulkCreateRelatedUserStories/', async (req, res) => {
  const { username, password, projectId, epicId, userStories } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const epicData = await bulkCreateRelatedUserStories(token, projectId, epicId, userStories)
  if (!epicData.success) {
    return res.status(500).send(epicData)
  }
  return res.status(201).send(epicData)
})

module.exports = app
