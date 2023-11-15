import * as API from './seca-web-api.mjs'
import express from 'express';
var app = express();

const PORT = 2003;
console.log("Starting server on port", PORT);
app.get('/', (req, res) => {
  res.send('Welcome to SECA API');
});
app.get('/event/list', API.getPopularEventsListByDefault);
app.get('/event/search', API.getEventNamesByDefault);
app.get('/event/list/:s/:p', API.getPopularEventsList);
app.get('/event/search/:s/:p', API.getEventNames);
app.post('/group', API.createGroup);
app.put('/group', API.editGroup);
app.get('/group', API.listGroups);
app.delete('/group/:id', API.deleteGroup);
app.put('/group/add/:id', API.addEvent);
app.delete('/group/remove/:id', API.removeEvent);
app.post('/user', API.createUser);
app.listen(PORT, (err) => {
  if (err)
    return console.log('Something bad happened', err);
  console.log(`Example app listening at http://localhost:${PORT}`);
});