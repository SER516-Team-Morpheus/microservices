const request = require('supertest')
const app = require('./index.js')
const username = 'taigatestser516'
const password = 'testuser'
const projectID = '722202'
const baseName = 'testsprint' // base project name
const randomSuffix = Math.floor(Math.random() * 10000000) // generate a random number
const sprintname = `${baseName}_${randomSuffix}`
const sprint = {
  estimated_finish: '2023-05-29',
  estimated_start: '2023-05-25',
  name: sprintname,
  project: projectID
}
const basePatchName = 'testsprintpatch' // base project name
const randomSuffixPatch = Math.floor(Math.random() * 10000000) // generate a random number
const sprintPatchName = `${basePatchName}_${randomSuffixPatch}`
const patch = {
  name: sprintPatchName
}

describe('Create Sprint', () => {
  describe('POST /createSprint', () => {
    it('should return 201 and created sprint if request is valid', async () => {
      const response = await request(app)
        .post('/createSprint')
        .send({ sprint, username, password })
        .expect(201)
      expect(response.body).toHaveProperty('name', sprint.name)
      expect(response.body).toHaveProperty('id')
    })
    it('should return 500 if error occurs while same name sent in sprint object', async () => {
      const response = await request(app)
        .post('/createSprint')
        .send({ sprint, username, password })
        .expect(500)
      expect(response.body).toEqual({ error: 'Error creating sprint' })
    })
  })
})

describe('Fetch Sprints', () => {
  describe('GET /sprints', () => {
    it('should return 500 if project ID is not sent in request body', async () => {
      const response = await request(app)
        .get('/sprints')
        .send({ username, password })
      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Project ID is not sent in request body.', success: false })
    })

    it('should return 200 and list of sprints if request is valid', async () => {
      const response = await request(app)
        .get('/sprints')
        .send({ username, password, projectID })
        .expect(200)
      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.success).toBe(true)
    })

    it('should return 500 if error occurs while retrieving sprints', async () => {
      const response = await request(app)
        .get('/sprints')
        .send({ username, password, projectID: 'dummy' })
        .expect(500)
      expect(response.body).toEqual({ error: 'Error retrieving sprints.', success: false })
    })
  })
})

describe('Fetch Sprint by Name', () => {
  describe('GET /sprintByName', () => {
    it('should return 200 and sprint data if sprint is found', async () => {
      const response = await request(app)
        .get('/sprintByName')
        .send({ username, password, sprintName: sprintname, projectID })
        .expect(200)

      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.success).toBe(true)
      expect(response.body.sprint).toBeDefined()
      expect(response.body.sprint.name).toBe(sprintname)
    })

    it('should return 500 if an error occurs while retrieving the sprint', async () => {
      const response = await request(app)
        .get('/sprintByName')
        .send({ username, password, sprintName: 'random_name', projectID })
        .expect(500)

      expect(response.body.success).toEqual(false)
    })
  })
})

describe('Edit Sprint', () => {
  describe('PATCH /editSprintByName', () => {
    it('should return 201 if patch is successful', async () => {
      const response = await request(app)
        .patch('/editSprintByName')
        .send({ username, password, patch, projectID, sprintName: sprintname })
      expect(response.body.name).toEqual(patch.name)
    })

    it('should return 500 if an error occurs during patching', async () => {
      const response = await request(app)
        .patch('/editSprintByName')
        .send({ patch, username, password, projectID, sprintName: 'wrong sprint' })
        .expect(500)
      expect(response.body).toEqual({ error: 'Error editing sprint' })
    })
  })
})

describe('Delete Sprints', () => {
  describe('DELETE /deleteSprintByName', () => {
    it('should return 201 and acknowledgement if sprint is successfully deleted', async () => {
      const response = await request(app)
        .post('/deleteSprintByName')
        .send({ username, password, sprintName: patch.name, projectID })

      expect(response.status).toBe(201)
      expect(response.body.status).toEqual(
        'Deleted Successfully'
      )
    })

    it('should return 500 if there is an error deleting the sprint', async () => {
      const response = await request(app)
        .post('/deleteSprintByName')
        .send({ username, password, sprintname, projectID })

      expect(response.status).toBe(500)
    })
  })
})
