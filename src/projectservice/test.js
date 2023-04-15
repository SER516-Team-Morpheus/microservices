/* eslint-disable no-undef */
const request = require('supertest')
const app = require('./index')

const username = 'SERtestuser'
const password = 'testuser'

// eslint-disable-next-line quote-props
const patch = { 'name': 'RenamebyAPI' }
// eslint-disable-next-line no-unused-vars
let projID = ''
describe('Project Microservice', () => {
  describe('POST /createProject', () => {
    it('should return a 201 response', async () => {
      const baseName = 'testProject' // base project name
      const randomSuffix = Math.floor(Math.random() * 10000) // generate a random number
      const projectName = `${baseName}_${randomSuffix}`
      const response = await request(app)
        .post('/createProject')
        .set('Accept', 'application/json')
        .send({
          username: username,
          password: password,
          name: projectName,
          description: 'testProject'
        })
      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.projectId).toBeDefined()
      expect(response.body.projectName).toBeDefined()
      expect(response.body.slugName).toBeDefined()
      expect(response.body.description).toBeDefined()
      projID = response.body.projectId
    })
    it('should return a 500 response', async () => {
      const response = await request(app)
        .post('/createProject')
        .set('Accept', 'application/json')
        .send({
          username: username,
          password: password,
          name: 'testProject',
          description: 'testProject'
        })
      expect(response.status).toBe(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })

  // test case for getProjectBySlug endpoint
  describe('GET /getProjectBySlug', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .get('/getProjectBySlug')
        .set('Accept', 'application/json')
        .query({
          username: 'SERtestuser',
          password: 'testuser',
          name: 'testProject'
        })
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.projectId).toBeDefined()
      expect(response.body.projectName).toBeDefined()
      expect(response.body.slugName).toBeDefined()
      expect(response.body.description).toBeDefined()
    })
    it('should return a 404 response', async () => {
      const response = await request(app)
        .get('/getProjectBySlug')
        .set('Accept', 'application/json')
        .query({
          username: 'SERtestuser',
          password: 'testuser',
          name: 'gibberish'
        })
      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })

  describe('Update Project Name', () => {
    describe('PATCH /updateProject/:projectID', () => {
      it('should return 201 if patch is successful', async () => {
        console.log(projID)
          .patch(`/updateProject/${projID}`)
          .send({ username, password, patch })
          .expect(201)
        // expect(response.body.name).toEqual(patch.name)
      })

      it('should return 500 if an error occurs during patching', async () => {
        const response = await request(app)
          .patch('/updateProject/dummy')
          .send({ patch, username, password })
          .expect(500)
        expect(response.body).toEqual({ error: 'Error editing project' })
      })
    })
  })

  describe('Delete Project', () => {
    describe('DELETE /deleteProject/:projectID', () => {
      it('should return 201 and acknowledgement if sprint is successfully deleted', async () => {
        const response = await request(app)
          .delete(`/deleteProject/${projID}`)
          .send({ username, password })

        expect(response.status).toBe(201)
        expect(response.body.status).toEqual(
          'Project Deleted Successfully'
        )
      })

      it('should return 500 if there is an error deleting the sprint', async () => {
        const response = await request(app)
          .delete('/deleteProject/dummy')
          .send({ username, password })
        expect(response.status).toBe(500)
      })
    })
  })
})
