const axios = require('axios')
require('dotenv').config({ path: '../.env' })
const moment = require('moment')

const PROJECT_API_URL = `${process.env.TAIGA_API_BASE_URL}/projects`
const TASK_API_URL = `${process.env.TAIGA_API_BASE_URL}/tasks`
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
    const randomNumber = Math.floor(Math.random() * 100)
    const name = 'Simulation' + randomNumber
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
        projectName: name,
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

//Function to create sprint
async function createSprint(token, project) {
  let flag = true
  let sprint = []
  try {
    let name
    let estimated_start = moment().format('YYYY-MM-DD')
    let estimated_finish = moment(estimated_start)
      .add(7, 'days')
      .format('YYYY-MM-DD')
    for (let i = 1; i <= 3; i++) {
      name = 'sprint' + i
      const response = await axios.post(
        `${TAIGA_API_URL}/milestones`,
        {
          project,
          name,
          estimated_start,
          estimated_finish,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.data.id) {
        console.log(`${name} created successfully`)
        sprint.push({
          success: true,
          sprintId: response.data.id,
          sprintName: response.data.name,
        })
        estimated_start = estimated_finish
        estimated_finish = moment(estimated_start)
          .add(7, 'days')
          .format('YYYY-MM-DD')
      } else {
        flag = false
        sprint.push({
          success: false,
          sprintId: null,
          sprintName: null,
        })
      }
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      error: error.data,
    }
  }
  if (flag) {
    return {
      success: true,
      sprint: sprint,
    }
  } else {
    return {
      success: false,
      sprint: sprint,
    }
  }
}

async function createUserstory(token, project) {
  const userStories = [
    {
      project,
      subject: 'UserStory1',
    },
    {
      project,
      subject: 'UserStory2',
    },
    {
      project,
      subject: 'UserStory3',
    },
    {
      project,
      subject: 'UserStory4',
    },
  ]
  const newResponse = []
  try {
    for (let userStory of userStories) {
      const response = await axios.post(
        `${TAIGA_API_URL}/userstories`,
        {
          project: userStory.project,
          subject: userStory.subject,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.id) {
        newResponse.push({
          userStoryName: userStory.subject,
          userstoryId: response.data.id,
          message: `${userStory.subject} successfully created.`,
        })
      } else {
        newResponse.push({
          message: 'Something went wrong while creating userstory',
        })
      }
    }
    return {
      success: true,
      userStories: newResponse,
    }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error creating userstory' }
  }
}

async function moveUserStory(token, projectId, milestoneId, userStoryIds) {
  try {
    const response = await axios.post(
      `${TAIGA_API_URL}/userstories/bulk_update_backlog_order`,
      {
        project_id: projectId,
        bulk_userstories: userStoryIds,
        milestone_id: milestoneId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data[0].id) {
      return {
        success: true,
        message: `User stories moved to sprint ${milestoneId}`,
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while moving user stories',
      }
    }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error moving user stories' }
  }
}

//Function to create task
async function createTask(token, project, userStories, userStoryNames) {
  let newResponse = []
  for (let i = 0; i < userStories.length; i++) {
    user_story = userStories[i]
    userStoryName = userStoryNames[i]
    for (let j = 1; j <= 2; j++) {
      let subject = 'Task' + j
      const response = await axios.post(
        `${TAIGA_API_URL}/tasks`,
        {
          project,
          user_story,
          subject,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      newResponse.push({
        userStoryName: userStoryName,
        userStoryId: user_story,
        taskName: subject,
        taskId: response.data.id,
        status: response.data.status_extra_info.name,
      })
    }
  }
  return {
    success: true,
    tasks: newResponse,
  }
}

async function updateTaskPush(currTask, projectId, token, status) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token.token}`,
  }
  console.log(currTask)
  const data = {
    project: projectId,
    subject: currTask.subject,
    status: status,
    version: currTask.version,
  }

  const response = await axios.patch(TASK_API_URL + '/' + currTask.id, data, {
    headers,
  })
  if (response.data.id) {
    return {
      success: true,
    }
  }
}

module.exports = {
  getToken,
  createProject,
  updateRole,
  deleteRole,
  deletePoints,
  createPoints,
  updateTaskStatus,
  createSprint,
  createUserstory,
  updateTaskPush,
  moveUserStory,
  createTask,
}
