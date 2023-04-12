const express = require('express')
const { getCFDData } = require('./logic')

const app = express()
const port = 3010

app.get('/cfd-data', async (req, res) => {
  try {
    const cfdData = await getCFDData()
    res.status(200).json(cfdData)
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
})

app.listen(port, () => {
  console.log(`CFD microservice running at http://localhost:${port}`)
})

module.exports = app
