import supertest from 'supertest';
import app from '../seca-server.mjs';

const user = supertest(app)
const group = supertest(app)
const event = supertest(app)

app.get('/user', function(req, res) {
  res.status(200).json({ name: 'john' });
});
describe('GET /user', function() {
  it('responds with json', function(done) {
    user.get('/user')
    .expect('Content-Type','application/json; charset=utf-8')
    .expect('Content-Length', '15')
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
    });
    done();
  });
});

// group.get('/group')