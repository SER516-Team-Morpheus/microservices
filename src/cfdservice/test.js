const request = require('supertest')
const { app, getEmptyStatusMatrix } = require('./index')

describe('GET /cfd', () => {
  test('returns CFD data for the given project name', async () => {
    const projectName = 'TestProject'
    const response = await request(app)
      .get('/cfd')
      .send({ projectName })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(response.body.project).toEqual(projectName)
  }, 15000)

  test('returns an error if project not found', async () => {
    const projectName = 'NonexistentProject'
    const response = await request(app)
      .get('/cfd')
      .send({ projectName })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
    expect(response.body.error).toEqual('Project Not Found')
  }, 15000)
})

describe('getEmptyStatusMatrix', () => {
  test('returns the task statuses for a valid project', async () => {
    const slug = 'sertestuser-testproject'
    const result = await getEmptyStatusMatrix(slug)
    expect(result.success).toBe(true)
    expect(result.statuses).toBeDefined()
  }, 15000)

  test('returns an error for an invalid project', async () => {
    const slug = 'invalid-project'
    const result = await getEmptyStatusMatrix(slug)
    expect(result.success).toBe(false)
    expect(result.error).toEqual('Error Finding Project')
  }, 15000)
})
