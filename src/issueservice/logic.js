const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const AUTH_API_URL = `https://api.taiga.io/api/v1/auth`
const ISSUE_API_URL = `https://api.taiga.io/api/v1/issues`

async function getItemId(apiEndpoint, projectId, itemName, authToken) {
    const response = await axios.get(`https://api.taiga.io${apiEndpoint}?project=${projectId}`,
        {
        headers: { Authorization: `Bearer ${authToken}` }
        });
    const items = response.data;
    const item = items.find(i => i.name === itemName);
    return item ? item.id : null;
  }

async function getItemName(apiEndpoint, projectId, itemId, authToken) {
    const response = await axios.get(`https://api.taiga.io${apiEndpoint}?project=${projectId}`,
        {
        headers: { Authorization: `Bearer ${authToken}` }
        });
    const items = response.data;
    const item = items.find(i => i.id === itemId);
    return item ? item.name : null;
}  

async function createIssue(username, password, assigned_to, blocked_note, description, project
    , severity, status, subject, is_blocked, priority, type, is_closed){
    try {
    const response1 = await axios.post(AUTH_API_URL, {
        type: 'normal',
        username,
        password
        })
    const authToken = response1.data.auth_token
    const typeApiEndpoint = '/api/v1/issue-types';
    const typeId = await getItemId(typeApiEndpoint, project, type, authToken);
    const severityApiEndpoint = '/api/v1/severities';
    const severityId = await getItemId(severityApiEndpoint, project, severity,authToken);
    const priorityApiEndpoint = '/api/v1/priorities';
    const priorityId = await getItemId(priorityApiEndpoint, project, priority, authToken);  
    const statusApiEndpoint = '/api/v1/issue-statuses';
    const statusId = await getItemId(statusApiEndpoint, project, status, authToken); 
        const response = await axios.post(
          ISSUE_API_URL,
          {
            assigned_to,
            blocked_note,
            description, 
            project,
            severity: severityId, 
            status: statusId, 
            subject, 
            is_blocked, 
            priority: priorityId, 
            type: typeId,
            is_closed,
          },
          { headers: { Authorization: `Bearer ${authToken}` } }
        )
        if (response.data.id) {
          return { success: true, issueId: response.data.id }
        } else {
          return {
            success: false,
            message: 'Something went wrong while creating an issue'
          }
        }
      } catch (error) {
        return { success: false, message: 'Error creating issue' }
      }     
}

async function getIssues (username, password, projectId) {
    try{
    const response1 = await axios.post(AUTH_API_URL, {
      type: 'normal',
      username,
      password
    })
    const token = response1.data.auth_token
    const ISSUES_API_URL = `${ISSUE_API_URL}?project=${projectId}`
      const response = await axios.get(ISSUES_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
  
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, message: 'Error getting issues' }
    }
  }

async function getIssue (username, password, issueId) {
    try {
    const response1 = await axios.post(AUTH_API_URL, {
      type: 'normal',
      username,
      password
    })
    const token = response1.data.auth_token
    const ISSUES_API_URL = `${ISSUE_API_URL}/${issueId}`
      const response = await axios.get(ISSUES_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const severityApiEndpoint = '/api/v1/severities';
      const severity = response.data.severity
      response.data.severity = await getItemName(severityApiEndpoint, response.data.project, severity, token);
      const priorityApiEndpoint = '/api/v1/priorities';
      const priority = response.data.priority
      response.data.priority = await getItemName(priorityApiEndpoint, response.data.project, priority, token);
      const typeApiEndpoint = '/api/v1/issue-types';
      const type = response.data.type
      response.data.type = await getItemName(typeApiEndpoint, response.data.project, type, token);
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, message: 'Error getting issue' }
    }
}

// Function to delete an issue
async function deleteIssue (username, password, issueId) {
    try {
    const response1 = await axios.post(AUTH_API_URL, {
      type: 'normal',
      username,
      password
    })
    const token = response1.data.auth_token
    const ISSUES_API_URL = `${ISSUE_API_URL}/${issueId}`
      const response = await axios.delete(
        ISSUES_API_URL,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
  
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  async function getToken (username, password) {
  try {
    const response = await axios.post(AUTH_API_URL, {
      type: 'normal',
      username,
      password
    })
    if (response.data.auth_token) {
      return response.data.auth_token
    }
    return { auth_token: 'NULL' }
  } catch (error) {
    return { auth_token: 'NULL' }
  }
} 

async function getIssueDetails(authToken, slugName, issueName)
{
  try {
      const ISSUEDETAILS_URL = `${ISSUE_API_URL}?project__slug=${slugName}`
      const response  = await axios.get(
        ISSUEDETAILS_URL,
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      const parameters = {}
      for (let i = 0; i < response.data.length; i += 1) {
        if (response.data[i].subject === issueName)
        {
          parameters.subject = response.data[i].subject
          parameters.issueId = response.data[i].id
          parameters.version = response.data[i].version
          if (response.data[i].status_extra_info.name.toLowerCase() === 'new') {
            parameters.status_id = response.data[i].status
          } else if (response.data[i].status_extra_info.name.toLowerCase() === 'in progress') {
            parameters.status_id = response.data[i].status - 1
          } else if (response.data[i].status_extra_info.name.toLowerCase() === 'ready for test') {
            parameters.status_id = response.data[i].status - 2
          } else if (response.data[i].status_extra_info.name.toLowerCase() === 'closed') {
            parameters.status_id = response.data[i].status - 3
          } else if (response.data[i].status_extra_info.name.toLowerCase() === 'needs info') {
            parameters.status_id = response.data[i].status - 4
          } else if (response.data[i].status_extra_info.name.toLowerCase() === 'rejected') {
            parameters.status_id = response.data[i].status - 5
          } else if(response.data[i].status_extra_info.name.toLowerCase() === 'postponed') {
            parameters.status_id = response.data[i].status - 6
          }
        } 
        
      }
      if (parameters.issueId) {
        return {
          success: true,
          message: 'successfully fetched details',
          parameters
        }
      }
  
      return {
        success: false,
        message: 'Issue not found'
      }
      
  } catch (error) {

    return { success: false, message : "Error fetching issue details"}
    
  }
}
async function updateIssue(authToken, issueId,parameters){
  try {
    
    const issue_API_URL = `${ISSUE_API_URL}/${issueId}`
    const response = await axios.patch(
      issue_API_URL,
      parameters,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    return { success: true, message : "Issue Updated successfully"}
  } catch (error) {
    console.log(error)
    return { success: false, message : "Error updating issues"}
  }
}
  

module.exports = {
    createIssue,
    getIssues,
    getIssue,
    deleteIssue,
    updateIssue,
    getToken,
    getIssueDetails
  }