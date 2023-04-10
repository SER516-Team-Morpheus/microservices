const request = require('supertest')
const app = require('./index.js')
const username = 'taigatestser516'
const password = 'testuser'
const projectName = 'Test Project 1'
const sprint = {
  disponibility: 30,
  estimated_finish: '2023-05-29',
  estimated_start: '2023-05-25',
  name: 'Sprints Unit Test',
  order: 1,
  projectName,
  slug: 'sprints-unit-test',
  watchers: []
}
let createdSprintID = ''
let sprintName = ''
describe('Create Sprint', () => {
  describe('POST /createSprint', () => {
    it('should return 201 and created sprint if request is valid', async () => {
      const response = await request(app)
        .post('/createSprint')
        .send({ sprint, username, password })
        .expect(201)
      expect(response.body).toHaveProperty('name', sprint.name)
      expect(response.body).toHaveProperty('id')
      createdSprintID = response.body.id
      sprintName = response.body.name
    })
    it('should return 500 if error occurs while same name sent in sprint object', async () => {
      const response = await request(app)
        .post('/createSprint')
        .send({ sprint, username, password })
        .expect(500)
      expect(response.body).toHaveProperty('error')
    })
  })
})

// eslint-disable-next-line no-undef
describe('Fetch Sprints', () => {
  // eslint-disable-next-line no-undef
  describe('GET /sprints', () => {
    // eslint-disable-next-line no-undef
    it('should return 500 if project ID is not sent in request body', async () => {
      const response = await request(app)
        .get('/sprints')
        .send({ username, password })
      // eslint-disable-next-line no-undef
      expect(response.status).toBe(500)
      // eslint-disable-next-line no-undef
      expect(response.body).toEqual({ error: 'Project Name is not sent in request body.', success: false })
    })

    // eslint-disable-next-line no-undef
    it('should return 200 and list of sprints if request is valid', async () => {
      const response = await request(app)
        .get('/sprints')
        .send({ username, password, projectName })
        .expect(200)
      // eslint-disable-next-line no-undef
      expect(response.status).toBe(200)
      // eslint-disable-next-line no-undef
      expect(response.body).toBeDefined()
      // eslint-disable-next-line no-undef
      expect(response.body.success).toBe(true)
    })

    // eslint-disable-next-line no-undef
    it('should return 500 if error occurs while retrieving sprints', async () => {
      const response = await request(app)
        .get('/sprints')
        .send({ username, password, projectName: 'Dummy' })
        .expect(500)
      // eslint-disable-next-line no-undef
      expect(response.body).toHaveProperty('success', false)
    })
  })
})

describe('Fetch Sprint by Name', () => {
  describe('GET /sprintByName', () => {
    it('should return 200 and sprint data if sprint is found', async () => {
      // call the endpoint with a valid sprint ID and the token
      const response = await request(app)
        .get('/sprintByName')
        .send({ username, password, sprintName, projectName })
        .expect(200)

      // check that the response contains the expected data
      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.success).toBe(true)
      expect(response.body.sprint).toBeDefined()
      expect(response.body.sprint.name).toBe('Sprints Unit Test')
    })

    it('should return 500 if an error occurs while retrieving the sprint', async () => {
      // call the endpoint with a non-existent sprint ID and the token
      const response = await request(app)
        .get('/sprintByName')
        .send({ username, password, sprintName: 'random_name', projectName })
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
        .send({ username, password, patch: { name: 'new-testing R (Do Not Use)' }, projectName, sprintName })
      expect(response.body.name).toEqual('new-testing R (Do Not Use)')
    })

    it('should return 500 if an error occurs during patching', async () => {
      const response = await request(app)
        .patch('/editSprintByName')
        .send({ patch: { name: 'new-testing R (Do Not Use)' }, username, password, projectName, sprintName: 'wrong sprint' })
        .expect(500)
      expect(response.body).toHaveProperty('error')
    })
  })
})

describe('Delete Sprints', () => {
  describe('DELETE /deleteSprintByName', () => {
    it('should return 201 and acknowledgement if sprint is successfully deleted', async () => {
      const response = await request(app)
        .delete('/deleteSprintByName')
        .send({ username, password, sprintName, projectName })

      expect(response.status).toBe(201)
      expect(response.body.status).toEqual(
        'Deleted Successfully'
      )
      expect(response.body.sprintID).toEqual(
        createdSprintID
      )
    })

    it('should return 500 if there is an error deleting the sprint', async () => {
      const response = await request(app)
        .delete('/deleteSprintByName')
        .send({ username, password, sprintName, projectName })

      expect(response.status).toBe(500)
    })
  })
})
