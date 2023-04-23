const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const TASK_API_URL = `${process.env.TAIGA_API_BASE_URL}/tasks`


async function updateTaskPush(currTask, projectId, token, status){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.token}`
    };
    console.log(currTask)
    const data = {
      project: projectId,
      subject: currTask.subject,
      status: status,
      version: currTask.version
    };
    
    const response = await axios.patch(TASK_API_URL + "/"+ currTask.id, data, { headers })
    if (response.data.id) {
        return {
          success: true,
        }
   }
}

module.exports = {
    updateTaskPush
}