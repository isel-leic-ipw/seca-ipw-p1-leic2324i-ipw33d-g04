import supertest from 'supertest';
import express from 'express';
import request from 'supertest';
import assert from  'assert'
import API from '../web/api/seca-web-api.mjs'
import WEB from '../web/site/seca-web-site.mjs'
import SERVICES from '../services/seca-services.mjs'
import TICKETMASTER from '../ticketmaster/tm-events-data.mjs'
import DATA_ELASTIC from '../data/seca-group-data-elastic.mjs'
import DATA_MEM from '../data/seca-data-mem.mjs'

const app = express();
const services = SERVICES(DATA_MEM, DATA_ELASTIC, TICKETMASTER)
const api = API(services)
const web = WEB(services)
//change it to a valid token for each machine
const token = 'dd5e434b-b55d-4b39-bac5-2c9c8664c5ee'

const user = supertest(app)
const group = supertest(app)
const event = supertest(app)

//user api
app.get('/user', function(req, res) {
  res.status(200).json({ name: 'john' });
});
app.post('/user', api.createUser);

//group api
app.put('/group/add', api.addEventToGroup);
app.delete('/group/remove', api.removeEventFromGroup);
app.post('/group', api.createGroup);
app.put('/group', api.editGroup);
app.get('/group/list', api.listAllGroups);
app.get('/group/:id', api.getGroup);
app.delete('/group/:id', api.deleteGroup);
//event api
app.get('/event/list', api.getAllPopularEventsList);
app.get('/event/search/:name', api.getEventsByName);
app.get('/event/:id', api.getEventById);

//user web
app.get('/site/user', function(req, res) {
  res.status(200).json({ name: 'john' });
});
app.post('/site/user', web.createUser);

//group web
app.post('/site/group/add', web.addEventToGroup);
app.post('/site/group/remove', web.removeEventFromGroup);
app.post('/site/createGroup', web.createGroup);
app.post('/site/editGroup', web.editGroup);
app.post('/site/deleteGroup', web.deleteGroup);
app.get('/site/group/list', web.listAllGroups);
app.get('/site/group/:id', web.getGroup);
//event web
app.get('/site/event/list', web.getAllPopularEventsList);
app.get('/site/event/search/:name', web.getEventsByName);
app.get('/site/event/:id', web.getEventById);
// Is possible to test individually by commenting the lines for API or WEB and inside the describe of them
describe('API Tests', () => {
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
      .send(newUser)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.name, 'Jane');
        done();
      });
  });
  
  it('create group', function(done) {
    const newGroup = {
      name: 'Music',
      description: 'Portugal singers'
    }
    request(app)
      .post('/group')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(newGroup)
      .expect(201)
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
      .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.id, '1');
        done();
      });
  })
  it('list groups', function(done) {
    request(app)
      .get('/group/list')
      .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(editedGroup)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.name, editedGroup.name);
        assert.strictEqual(res.body.description, editedGroup.description);
        done();
      });
    })
  it('add event to group', function(done) {
    const event = {
      eventId: '1',
      groupId: 'tt0111161'
    }
    request(app)
    .put('/group/add')
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(event)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      assert.strictEqual(res.body.events.length, 1);
      done();
    });
  })
  it('remove event from group', function(done) {
    const event = {
      eventId: '1',
      groupId: 'tt0111161'
    }
    request(app)
    .delete('/group/remove')
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(event)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      assert.strictEqual(res.body.events.length, 0);
      done();
    });
  })

  it('get event by id', function(done) {
    request(app)
      .get('/event/tt0111161')
      .set('Authorization', 'Bearer ' + token)
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
      .get('/event/search/Hamilton')
      .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.length, 0);
        done();
      });
  })
})
  
  
describe('WEB Tests', () => {
  it('get user', function(done) {
    request(app)
      .get('/site/user')
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
      .post('/site/user')
      .set('Accept', 'application/json')
      .send(newUser)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.name, 'Jane');
        done();
      });
  });
  
  it('create group', function(done) {
    const newGroup = {
      name: 'Music',
      description: 'Portugal singers'
    }
    request(app)
      .post('/site/createGroup')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(newGroup)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.name, newGroup.name);
        assert.strictEqual(res.body.description, newGroup.description);
        done();
      });
  });
  it('delete group', function(done) {
    request(app)
      .post('/site/deleteGroup')
      .set('Authorization', 'Bearer ' + token)
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
      .get('/site/group/1')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.id, '1');
        done();
      });
  })
  it('list groups', function(done) {
    request(app)
      .get('/site/group/list')
      .set('Authorization', 'Bearer ' + token)
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
      .put('/site/editGroup')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(editedGroup)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.name, editedGroup.name);
        assert.strictEqual(res.body.description, editedGroup.description);
        done();
      });
    })
  it('add event to group', function(done) {
    const event = {
      eventId: '1',
      groupId: 'tt0111161'
    }
    request(app)
    .put('/site/group/add')
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(event)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      assert.strictEqual(res.body.events.length, 1);
      done();
    });
  })
  it('remove event from group', function(done) {
    const event = {
      eventId: '1',
      groupId: 'tt0111161'
    }
    request(app)
    .delete('/site/group/remove')
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(event)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      assert.strictEqual(res.body.events.length, 0);
      done();
    });
  })

  it('get event by id', function(done) {
    request(app)
      .get('/site/event/tt0111161')
      .set('Authorization', 'Bearer ' + token)
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
      .get('/site/event/search/Hamilton')
      .set('Authorization', 'Bearer ' + token)
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
      .get('/site/event/list')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.notEqual(res.body.length, 0);
        done();
      });
  })
})