const request = require('supertest');
const app = require('./index.js');
const username = "taigatestser516";
const password = "testuser";
const sprintID = "344632";
const projectID = '722202';
const sprint = {
    "disponibility": 30,
    "estimated_finish": "2023-05-29",
    "estimated_start": "2023-05-25",
    "name": "Sprint 3",
    "order": 1,
    "project": projectID,
    "slug": "sprint-3",
    "watchers": []
}
let createdSprintID = "";
const patch = { "name": 'new-testing (Do Not Use)' };

describe("Fetch Sprints", () => {
    describe('GET /sprints', () => {
        it('should return 500 if project ID is not sent in request body', async () => {
            const response = await request(app)
                .get('/sprints')
                .send({ username, password });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Project ID is not sent in request body.', "success": false });
        });

        it('should return 200 and list of sprints if request is valid', async () => {
            const response = await request(app)
                .get('/sprints')
                .send({ username, password, projectID })
                .expect(200);
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.success).toBe(true);


        });

        it('should return 500 if error occurs while retrieving sprints', async () => {
            const error = new Error('Something went wrong');
            const projectID = 'dummy';
            const response = await request(app)
                .get('/sprints')
                .send({ username, password, projectID })
                .expect(500);
            expect(response.body).toEqual({ error: 'Error retrieving sprints.', "success": false });
        });
    });
});

describe("Fetch Sprint by ID", () => {
    describe('GET /sprintByID/:sprintId', () => {
        it('should return 200 and sprint data if sprint is found', async () => {
            // call the endpoint with a valid sprint ID and the token
            const response = await request(app)
                .get('/sprintByID/' + sprintID)
                .send({ username, password })
                .expect(200);

            // check that the response contains the expected data
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.success).toBe(true);
            expect(response.body.sprints).toBeDefined();
            expect(response.body.sprints.id).toBe(parseInt(sprintID));

        });

        it('should return 500 if an error occurs while retrieving the sprint', async () => {
            // call the endpoint with a non-existent sprint ID and the token
            const response = await request(app)
                .get('/sprintByID/dummy')
                .send({ username, password })
                .expect(500);

            // check that the response contains the expected error message
            expect(response.body).toEqual({ error: 'Error retrieving sprint', "success": false });
        });
    });
});

describe('Create Sprint', () => {
    describe('POST /createSprint', () => {
        it('should return 201 and created sprint if request is valid', async () => {
            const response = await request(app)
                .post('/createSprint')
                .send({ sprint, username, password })
                .expect(201);
            expect(response.body).toHaveProperty('name', sprint.name);
            expect(response.body).toHaveProperty('id');
            createdSprintID = response.body.id;

        });

        it('should return 500 if error occurs while same name sent in sprint object', async () => {
            const response = await request(app)
                .post('/createSprint')
                .send({ sprint, username, password })
                .expect(500);
            expect(response.body).toEqual({ error: 'Error creating sprint' });
        });
    });
});

describe('Edit Sprint', () => {
    describe('PATCH /editSprint/:sprintId', () => {
        it('should return 201 if patch is successful', async () => {
            const response = await request(app)
                .patch(`/editSprint/${createdSprintID}`)
                .send({ username, password, patch });
            expect(response.body.name).toEqual(patch.name);
        });

        it('should return 500 if an error occurs during patching', async () => {
            const response = await request(app)
                .patch(`/editSprint/dummy`)
                .send({ patch, username, password })
                .expect(500);
            expect(response.body).toEqual({ error: 'Error editing sprint' });
        });
    });
});

describe("Delete Sprints", () => {
    describe("DELETE /deleteSprint/:sprintId", () => {
        it("should return 201 and acknowledgement if sprint is successfully deleted", async () => {
            const response = await request(app)
                .delete(`/deleteSprint/${createdSprintID}`)
                .send({ username, password });

            expect(response.status).toBe(201);
            expect(response.body.status).toEqual(
                "Deleted Successfully"
            );
            expect(response.body.sprintID).toEqual(
                createdSprintID.toString()
            );
        });

        it("should return 500 if there is an error deleting the sprint", async () => {
            const response = await request(app)
                .delete(`/deleteSprint/${createdSprintID}`)
                .send({ username, password });

            expect(response.status).toBe(500);
        });
    });
});



