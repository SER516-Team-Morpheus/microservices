const request = require('supertest')
const { app, getEmptyStatusMatrix } = require('./index')
const username = 'sertestuser'
const password = 'testuser'

describe('POST /cfd', () => {
  test('returns CFD data for the given project name', async () => {
    const projectName = 'do not delete'
    const response = await request(app)
      .post('/cfd')
      .send({ projectName, username, password })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(response.body).toBeDefined()
  }, 60000)

  test('returns an error if project not found', async () => {
    const projectName = 'NonexistentProject'
    const response = await request(app)
      .post('/cfd')
      .send({ projectName, username, password })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
    expect(response.body.error).toEqual('Project Not Found')
  }, 60000)
})

describe('getEmptyStatusMatrix', () => {
  test('returns the task statuses for a valid project', async () => {
    const slug = 'sertestuser-testproject'
    const result = await getEmptyStatusMatrix(slug, username, password)
    expect(result.success).toBe(true)
    expect(result.statuses).toBeDefined()
  }, 60000)

  test('returns an error for an invalid project', async () => {
    const slug = 'invalid-project'
    const result = await getEmptyStatusMatrix(slug, username, password)
    expect(result.success).toBe(false)
    expect(result.error).toEqual('Error Finding Project')
  }, 60000)
})
