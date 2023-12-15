import supertest from 'supertest';
// import express from 'express';
import app from '../seca-server.mjs';
import * as API from '../web/api/seca-web-api.mjs'
// import groupsData from '../data/group-data-elastic.mjs'
// import usersData from '../data/user-data-elastic.mjs'
// import tasksServicesInit from '../services/seca-services.mjs'

const request = supertest(app);
// const app = express();

// app.use(express.json())

// app.get('/event/list', API.getAllPopularEventsList);
// app.get('/event/search/:name', API.getEventsByName);
// app.put('/group/add', API.addEventToGroup);
// app.delete('/group/remove', API.removeEventFromGroup);
// app.post('/group', API.createGroup);
// app.put('/group', API.editGroup);
// app.get('/group/list', API.listAllGroups);
// app.get('/group/:id', API.getGroup);
// app.delete('/group/:id', API.deleteGroup);
// app.post('/user', API.createUser);
// app.use('/site', express.static('./seca-web-site.js'));

// app.get('/search', async (req, res) => {
  describe('Test Elasticsearch route', () => {
    it('should return 200 OK on GET /search', async () => {
      const response = await request.get('/search').query({ q: 'group' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('hits');
    });
  })
// });