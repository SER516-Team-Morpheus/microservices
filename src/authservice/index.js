const axios = require('axios')
const express = require('express')
require('dotenv').config({ path: '../.env' })

const app = express()
const port = 3001
const AUTH_API_URL = `${process.env.TAIGA_API_BASE_URL}/auth`
app.use(express.json())

async function authenticateUser (username, password) {
  try {
    const response = await axios.post(AUTH_API_URL, {
      type: 'normal',
      username,
      password
    })
    if (response.data.auth_token) {
      return { success: true, token: response.data.auth_token }
    } else {
      return { success: false, message: 'Invalid credentials' }
    }
  } catch (error) {
    console.log(error.response.data)
    return { success: false, message: 'Error authenticating user' }
  }
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

app.post('/authenticate', async (req, res) => {
  const { username, password } = req.body
  const authData = await authenticateUser(username, password)
  if (!authData.success) {
    return res.status(401).send({
      success: false,
      message: 'Authentication failed'
    })
  }
  return res.send(authData)
})

app.listen(port, () => {
  console.log(
    `Authentication microservice running at http://localhost:${port}`
  )
})

module.exports = app
