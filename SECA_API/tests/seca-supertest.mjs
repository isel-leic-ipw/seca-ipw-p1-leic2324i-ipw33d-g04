import supertest from 'supertest';
import app from '../seca-server.mjs';
import request from 'supertest';
import assert from  'assert'
import API from '../web/api/seca-web-api.mjs'
import SERVICES from '../services/seca-services.mjs'
import TICKETMASTER from '../ticketmaster/tm-events-data.mjs'
import DATA_ELASTIC from '../data/seca-group-data-elastic.mjs'
import DATA_MEM from '../data/seca-data-mem.mjs'

const services = SERVICES(DATA_MEM, DATA_ELASTIC, TICKETMASTER)
const api = API(services)

const token = '14d72b99-48f6-48d3-94d3-5a4dcfd96c80'

const user = supertest(app)
const group = supertest(app)
const event = supertest(app)

//user
app.get('/user', function(req, res) {
  res.status(200).json({ name: 'john' });
});
app.post('/user', api.createUser);

//group
app.put('/group/add', api.addEventToGroup);
app.delete('/group/remove', api.removeEventFromGroup);
app.post('/group', api.createGroup);
app.put('/group', api.editGroup);
app.get('/group/list', api.listAllGroups);
app.get('/group/:id', api.getGroup);
app.delete('/group/:id', api.deleteGroup);

//event
app.get('/event/list', api.getAllPopularEventsList);
app.get('/event/search/:name', api.getEventsByName);
app.get('/event/:id', api.getEventById);


describe('API Tests', () => {
  describe('User tests', function() {
    it('get user', function(done) {
      request(app)
        .get('/user')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.name, 'john');
          done();
        });
    });
    it('create user', function(done) {
      const newUser = { name: 'Jane' }; 
      request(app)
        .post('/user')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(newUser)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.name, 'Jane');
          done();
        });
    });
  });
  
  describe('Group tests', function() {
    it('create group', function(done) {
      const newGroup = {
        name: 'Music',
        description: 'Portugal singers'
      }
      request(app)
        .post('/group')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(newGroup)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.name, newGroup.name);
          assert.strictEqual(res.body.description, newGroup.description);
          done();
        });
    });
    it('delete group', function(done) {
      request(app)
        .delete('/group/1')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.id, '1');
          done();
        });
      })
    it('get group', function(done) {
      request(app)
        .get('/group/1')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.id, '1');
          done();
        });
     })
    it('list groups', function(done) {
      request(app)
        .get('/group/list')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.length, 1);
          done();
        });
     })
     it('edit group', function(done) {
      const editedGroup = {
        id: '1',
        name: 'Music',
        description: 'Portugal singers'
      }
      request(app)
        .put('/group')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(editedGroup)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.name, editedGroup.name);
          assert.strictEqual(res.body.description, editedGroup.description);
          done();
        });
      })
      it('add event to group', function(done) {
        request(app)
        .put('/group/1/event/tt0111161')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.events.length, 1);
          done();
        });
      })
      it('remove event from group', function(done) {
        request(app)
        .delete('/group/1/event/tt0111161')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.events.length, 0);
          done();
        });
      })

  });

  describe('Event tests', function() {
    it('get event by id', function(done) {
      request(app)
        .get('/event/tt0111161')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.id, 'tt0111161');
          assert.strictEqual(res.body.length, 1);
          done();
        });
     })
    it('get event by name', function(done) {
      request(app)
        .get('/event/search/Portugal')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.length, 1);
          done();
        });
     })
    it('list popular events', function(done) {
      request(app)
        .get('/event/list')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.notEqual(res.body.length, 0);
          done();
        });
     })
  })
})
  
  

