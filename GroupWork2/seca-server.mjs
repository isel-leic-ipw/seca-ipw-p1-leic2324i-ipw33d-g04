import * as API from './seca-web-api.mjs'
import express from 'express';
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'

var app = express();
const swaggerDocument = yaml.load('./do  cs/seca-api-spec.yaml')

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
const PORT = 2003;
console.log("Starting server on port", PORT);
app.get('/', (req, res) => {
  res.send('Welcome to SECA API');
});
app.use(express.json)

app.get('/event/list/:s/:p', API.getAllPopularEventsList);
app.get('/event/search/:s/:p', API.getEventsByName);
app.post('/group', API.createGroup);
app.put('/group', API.editGroup);
app.get('/group', API.listAllGroups);
app.delete('/group/:id', API.deleteGroup);
app.put('/group/add/:id', API.addEventToGroup);
app.delete('/group/remove/:id', API.removeEventFromGroup);
app.post('/user', API.createUser);
app.listen(PORT, (err) => {
  if (err)
    return console.log('Something bad happened', err);
  console.log(`Example app listening at http://localhost:${PORT}`);
});