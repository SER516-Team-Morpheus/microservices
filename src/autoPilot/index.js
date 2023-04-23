const express = require('express')
const axios = require('axios')

require('dotenv').config({ path: '../.env' })

const {updateTaskPush} = require('./logic')

const app = express()
const port = 3015
var globalTasks = []
var lastTaskId = -1
var minStatus = -1
var maxStatus = -1

app.use(express.json())

const PROJECT_API_URL = `${process.env.TAIGA_API_BASE_URL}/projects`
const TASK_API_URL = `${process.env.TAIGA_API_BASE_URL}/tasks`

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})
const TAIGA_API_URL = 'https://api.taiga.io/api/v1'

//Function to authenticate user
async function getToken(username, password) {
  try {
    const response = await axios.post(`${TAIGA_API_URL}/auth`, {
      type: 'normal',
      username: username,
      password: password,
    })
    if (response.data.id) {
      return {
        success: true,
        token: response.data.auth_token,
      }
    } else {
      return {
        success: false,
        message: 'Invalid Credential',
      }
    }
  } catch (error) {
    console.error('Failed to authenticate user', error)
  }
}

//Function to create project
async function createProject(token) {
  try {
    const name = 'Simulation'
    const description = 'Testing simulation'
    const response = await axios.post(
      `${TAIGA_API_URL}/projects`,
      {
        name,
        description,
        is_private: false,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data.id) {
      return {
        success: true,
        projectId: response.data.id,
        roles: response.data.roles,
        points: response.data.points,
        task_status: response.data.task_statuses,
        message: 'Project Create Successfully',
      }
    } else {
      return {
        success: false,
        message: 'Project was not created',
      }
    }
  } catch (error) {
    console.error('Failed to create project', error)
  }
}

//Function to update role
async function updateRole(token, roles) {
  let roleId
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === 'UX') {
      roleId = roles[i].id
      break
    }
  }
  const name = 'Developer'
  try {
    const response = await axios.patch(
      `${TAIGA_API_URL}/roles/${roleId}`,
      {
        name,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    if (response.data.id) {
      return {
        success: true,
        roleId: response.data.id,
        roleName: response.data.name,
        message: `Role ${response.data.name} successfully updated.`,
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while updating role',
      }
    }
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Error updating role' }
  }
}

async function deleteRole(token, roles) {
  let roleId
  let newResponse = []
  for (let i = 0; i < roles.length; i++) {
    if (
      roles[i].name == 'Design' ||
      roles[i].name == 'Front' ||
      roles[i].name == 'Back'
    ) {
      roleId = roles[i].id
      const DELETE_ROLE_API_URL = TAIGA_API_URL + '/roles/' + roleId
      try {
        const response = await axios.delete(DELETE_ROLE_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.status === 204) {
          newResponse.push({
            success: true,
            message: `Role ${roles[i].name} successfully deleted.`,
          })
        } else {
          newResponse.push({
            success: false,
            message: `Something went wrong while deleting ${roles[i].name} role`,
          })
        }
      } catch (error) {
        return { success: false, message: 'Error deleting  role' }
      }
    }
  }
  return newResponse
}

// function to delete the points from taiga
async function deletePoints(token, points) {
  let flag = true
  let defaultPoint
  try {
    for (let i = 0; i < points.length; i++) {
      if (points[i].name == '?') {
        defaultPoint = points[i].id
      }
    }
    for (let i = 0; i < points.length; i++) {
      if (points[i].name != '?') {
        const DELETE_POINT_API_URL = `${TAIGA_API_URL}/points/${points[i].id}`
        const response = await axios.delete(DELETE_POINT_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            moveTo: defaultPoint,
          },
        })

        if (response.status === 204) {
          console.log(`Point ${points[i].name} successfully deleted.`)
        } else {
          flag = false
          console.log(
            `Something went wrong while deleting point ${points[i].subject}.`
          )
        }
      }
    }
    if (flag) {
      return {
        success: true,
        message: 'All points deleted successfully',
      }
    } else {
      return {
        success: false,
        message: 'Few points were not deleted',
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

//Function to update task_status
async function updateTaskStatus(token, tasks) {
  let taskId
  let name
  const taskStatus = []
  let check = true
  for (let i = 0; i < tasks.length; i++) {
    let flag = false
    if (tasks[i].name === 'Needs Info') {
      taskId = tasks[i].id
      name = 'Blocked'
      flag = true
    }
    if (tasks[i].name === 'Closed') {
      taskId = tasks[i].id
      name = 'Done'
      flag = true
    }
    if (flag) {
      try {
        const response = await axios.patch(
          `${TAIGA_API_URL}/task-statuses/${taskId}`,
          {
            name,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (response.data.id) {
          taskStatus.push({
            success: true,
            taskId: response.data.id,
            taskName: response.data.name,
            message: `task ${response.data.name} successfully updated.`,
          })
        } else {
          taskStatus.push({
            success: false,
            message:
              'Something went wrong while updating task_status_attributes',
          })
          check = false
        }
      } catch (error) {
        console.log(error)
        return { success: false, message: 'Error updating task' }
      }
    }
  }
  if (check) {
    return {
      success: true,
      task: taskStatus,
    }
  }
}

// Function to create points
async function createPoints(token, project) {
  const POINTS_URL = `${TAIGA_API_URL}/points`
  const points = []
  let flag = true
  for (let i = 1; i <= 6; i++) {
    const value = i
    console.log(value)
    try {
      const response = await axios.post(
        POINTS_URL,
        {
          name: value,
          project,
          value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.data.id) {
        points.push({
          success: true,
          pointsId: response.data.id,
          pointsName: response.data.name,
          pointsValue: response.data.value,
          pointsOrder: response.data.order,
          message: 'Points created successfully',
        })
      } else {
        flag = flase
        points.push({
          success: false,
          message: 'Points wwas not created due to some issue.',
        })
      }
    } catch (error) {
      console.log(error)
      points.push({
        success: false,
        message: 'Error creating points for the project',
      })
    }
  }
  if (flag) {
    return {
      success: true,
      points: points,
    }
  } else {
    return {
      success: false,
      points: points,
    }
  }
}

// Endpoint for autopilot mode
app.post('/autoPilot', async (req, res) => {
  const { username, password } = req.body

  // authenticate user
  const token = await getToken(username, password)
  if (!token.success) {
    return res.status(401).send(token)
  }

  console.log(`${username} user authenticated successfully`)

  // create project for simulation
  const projectData = await createProject(token.token)
  if (!projectData.success) {
    return res.status(500).send(projectData)
  }

  console.log(`${projectData.projectId} project created successfully`)

  // update the role names
  const roles = projectData.roles
  const roleData = await updateRole(token.token, roles)
  if (!roleData.success) {
    return res.status(500).send(roleData)
  }

  console.log('Role name was updated from UX to Developer')

  //delete other roles
  const deleteRoleData = await deleteRole(token.token, roles)
  if (!deleteRoleData[0].success) {
    return res.status(500).send(deleteRoleData)
  }

  console.log('Front, Back and Design roles were deleted')

  //delete points
  const points = projectData.points
  const pointsData = await deletePoints(token.token, points)
  if (!pointsData.success) {
    return res.status(500).send(pointsData)
  }

  console.log('All the points were deleted')

  // create Points
  const projectId = projectData.projectId
  const createPointsData = await createPoints(token.token, projectId)
  if (!createPointsData.success) {
    return res.status(500).send(createPointsData)
  }

  console.log('Points 1 to 6 were created success')

  // update task statues
  const task = projectData.task_status
  const taskStatusData = await updateTaskStatus(token.token, task)
  if (!taskStatusData.success) {
    return res.status(500).send(taskStatusData)
  }

  console.log('Task statuses name updated successfully')

  return res.send(taskStatusData)
  const slugName = username.toLowerCase() + '-' + name.toLowerCase()
  const checkProjectName = await getProjectBySlug(token, slugName)
  if (!checkProjectName.success) {
    const projectData = await createProject(name, description, token)
    if (!projectData.success) {
      return res.status(500).send(projectData)
    }
    return res.status(201).send(projectData)
  }
  return res.status(500).send({
    success: false,
    message: 'Same project name already exist!',
    sol: 'Try different project name.',
  })
})
app.post('/moveTasks', async (req, res) => {
  const { username, password, roll, strategy, projectName, sprintId } = req.body
  const token = await getToken(username, password)
  if (!token.success) {
    return res.status(401).send(token)
  }
  const slugName = `${username.toLowerCase()}-${projectName.toLowerCase()}`  
  const PROJECT_SLUG_URL = PROJECT_API_URL + '/by_slug?slug=' + slugName
  const response = await axios.get(PROJECT_SLUG_URL, {
      headers: { Authorization: `Bearer ${token.token}` }
  })
  const projectId = response.data.id
  if(globalTasks.length == 0){
    try{
      const TASKS_URL = `${process.env.TAIGA_API_BASE_URL}/tasks?project=${projectId}&milestone=${sprintId}&order_by=us_order`
      //console.log(TASKS_URL)
      const response2 = await axios.get(TASKS_URL,{
        headers: { Authorization: `Bearer ${token.token}` }
      })
      const data = response2.data
      if(data.length == 0){
        return ({
          success: false,
          message: 'Error peforming simulation since there are no tasks',
        })
      }
      globalTasks = data.map(task => ({
        id: task.id,
        status: task.status,
        status_name: task.status_extra_info.name,
        subject: task.subject,
        version: task.version
      }))
      minStatus = globalTasks[0].status
      maxStatus = minStatus+3
    }catch (error) {
      //console.log(error)
      return ({
        success: false,
        message: 'Error peforming simulation',
      })
    }
    }
    if(strategy === "pull"){
      var currTask = -1;
      if(lastTaskId == -1){
        lastTaskId = 0
      }
      currTask = globalTasks[lastTaskId];
      console.log(currTask)
      console.log(maxStatus)
      if(roll > maxStatus-currTask.status){
          var leftOver = roll - (maxStatus-currTask.status)
          var leftOver2 = -1
          if(leftOver>3){
            leftOver2 = leftOver - 3
            leftOver = 3
          }
          await updateTask(currTask, projectId, token, maxStatus)
          if(lastTaskId +1 < globalTasks.length){
            lastTaskId = lastTaskId + 1
          }else{
            return res.status(201).send({success:true, message:"No more tasks lest for simulation"})
          }
          currTask = globalTasks[lastTaskId]
          await updateTask(currTask, projectId, token, currTask.status + leftOver)
          if(leftOver2 != -1){
            if(lastTaskId +1 < globalTasks.length){
              lastTaskId = lastTaskId + 1
            }else{
              return res.status(201).send({success:true, message:"No more tasks lest for simulation"})
            }
            currTask = globalTasks[lastTaskId]
            await updateTask(currTask, projectId, token, currTask.status + leftOver2)
          }else{
            if(globalTasks[lastTaskId].status == maxStatus){
              if(lastTaskId +1 < globalTasks.length){
                lastTaskId = lastTaskId + 1
              }else{
                return res.status(201).send({success:true, message:"No more tasks lest for simulation"})
              }
            }
          }
      }else if(roll == maxStatus - currTask.status){
        await updateTask(currTask, projectId, token, maxStatus)
        if(lastTaskId +1 < globalTasks.length){
          lastTaskId = lastTaskId + 1
        }else{
          return res.status(201).send({success:true, message:"No more tasks lest for simulation"})
        }
      }else{
          await updateTask(currTask, projectId, token, currTask.status + roll)
      }

    }else if(strategy === "push"){
      if(app.settings.currentTask === undefined){
        app.set('currentTask', 0);
      }
      try{
        const TASKS_URL = `${process.env.TAIGA_API_BASE_URL}/tasks?project=${projectId}&milestone=${sprintId}&order_by=us_order`
        const response2 = await axios.get(TASKS_URL,{
          headers: { Authorization: `Bearer ${token.token}` }
        })
        const data = response2.data
        if(data.length == 0){
          return ({
            success: false,
            message: 'Error peforming simulation since there are no tasks',
          })
        }
        globalTasks = data.map(task => ({
          id: task.id,
          status: task.status,
          status_name: task.status_extra_info.name,
          subject: task.subject,
          version: task.version
        }))
      }catch (error) {
        return ({
          success: false,
          message: 'Error peforming simulation',
        })
      }
      numberOfTask = globalTasks.length

      currentTaskNumber = app.settings.currentTask%numberOfTask
      currTask = globalTasks[currentTaskNumber]
      const TASK_STATUS_API_URL = `https://api.taiga.io/api/v1/task-statuses?project=${projectId}`
      const response = await axios.get(TASK_STATUS_API_URL,
        { headers: { Authorization: `Bearer ${token.token}` } }
      )
      minStatus = response.data[0].id
      maxStatus = minStatus + 3
      while(currTask.status === maxStatus)
      {
        currentTaskNumber = currentTaskNumber + 1;
        currTask = globalTasks[currentTaskNumber]
        if(currentTaskNumber === numberOfTask - 1)
        {
          return res.status(201).send({success:true, message:"No task left to do simulation"})
        }
      }
      
      if(roll <= maxStatus-currTask.status){
        newStatus = currTask.status + roll
        const taskUpdateDetails = await updateTaskPush(currTask, projectId, token, newStatus)
        if(taskUpdateDetails.success)
        {

          currentTaskNumber = currentTaskNumber + 1
          app.set('currentTask', currentTaskNumber);
          return res.status(201).send({success:true, message:"Task moved to new location"})  
        }
        else{
          return res.status(500).send({success:false, message:"Error moving tasks"})  
        }
    }
    else
    {
      try{
      var taskUpdateDetails
      var leftRoll = roll
       while(leftRoll > 0)
       {
        currentTaskNumber = currentTaskNumber%numberOfTask
        currTask = globalTasks[currentTaskNumber]
        if(leftRoll > maxStatus-currTask.status)
        {
          taskUpdateDetails = await updateTaskPush(currTask, projectId, token, maxStatus)
          leftRoll = leftRoll - (maxStatus-currTask.status)
          currentTaskNumber = currentTaskNumber + 1;
          
        }
        else
        {
          newStatus = currTask.status + leftRoll
          taskUpdateDetails = await updateTaskPush(currTask, projectId, token, newStatus)
          leftRoll = leftRoll - (newStatus - currTask.status)
          currentTaskNumber = currentTaskNumber + 1;   
          
        }
       }

        if(taskUpdateDetails.success)
        {
          app.set('currentTask', currentTaskNumber);
          return res.status(201).send({success:true, message:"Task moved to new location"})  
        }
        else{
          return res.status(500).send({success:false, message:"Error moving tasks"})  
        }
        
      }
    catch(error)
    {
      return res.status(500).send({success:false, message:"No more task left to move"})  
    }
  }
    }
    return res.status(201).send({success:true})
})

async function updateTask(currTask, projectId, token, status){
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
  globalTasks[lastTaskId].version = response.data.version
  globalTasks[lastTaskId].status = response.data.status
  globalTasks[lastTaskId].status_name = response.data.status_extra_info.name  
}

app.post('/endSimulation', async (req, res) => {
  const { username, password } = req.body
  const token = await getToken(username, password)
  if (!token.success) {
    return res.status(401).send(token)
  }
  globalTasks = []
  lastTaskId = -1
  minStatus = -1
  maxStatus = -1
  return res.status(200).send({success:true})
})
// Start the server
app.listen(port, () => {
  console.log(`Project microservice running at http://localhost:${port}`)
})

module.exports = app
