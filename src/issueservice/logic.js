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

async function createIssue(username, password, assigned_to, blocked_note, description, project
    , severity, status, subject, is_blocked, priority, type, is_closed){
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
    try {
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
    const response1 = await axios.post(AUTH_API_URL, {
      type: 'normal',
      username,
      password
    })
    const token = response1.data.auth_token
    const ISSUES_API_URL = `${ISSUE_API_URL}?project=${projectId}`
    try {
      const response = await axios.get(ISSUES_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
  
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, message: 'Error getting roles' }
    }
  }

module.exports = {
    createIssue,
    getIssues
  }