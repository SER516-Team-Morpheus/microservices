const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const PROJECT_API_URL = `${process.env.TAIGA_API_BASE_URL}/userstories/`;


// Function to delete the projects
const deleteStory = async (stories_id, token) => {
    try {
        let url = PROJECT_API_URL+ stories_id + "/"
        console.log(url)
        const response = await axios.delete(``, {
            headers: {
            'Authorization': `Bearer ${token}`,
            },
        });
            console.log(`User story ${stories_id} deleted successfully`);
        } catch (error) {
            console.error(`Error deleting user story ${stories_id}: ${error}`);
        }
  };



module.exports = {
    deleteStory
};
