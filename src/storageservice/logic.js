const axios = require('axios')
require('dotenv').config({ path: '../.env' })

async function getCFDData () {
  const tasksResponse = await axios.get('http://taskservice:3005/tasks')
  const tasks = tasksResponse.data

  const storiesResponse = await axios.get('http://userstoryservice:3003/userstories')
  const stories = storiesResponse.data

  const cfdData = {
    tasks: [],
    stories: []
  }

  // function to Group tasks by status
  const tasksByStatus = {}
  tasks.forEach((task) => {
    if (!tasksByStatus[task.status]) {
      tasksByStatus[task.status] = []
    }
    tasksByStatus[task.status].push(task)
  })

  // Build CFD data from tasks and user stories
  Object.keys(tasksByStatus).forEach((status) => {
    cfdData.tasks.push({
      status,
      count: tasksByStatus[status].length
    })
  })
  stories.forEach((story) => {
    cfdData.stories.push({
      name: story.name,
      status: story.status,
      count: tasks.filter((task) => task.storyId === story.id).length
    })
  })

  return cfdData
}

module.exports = {
  getCFDData
}
