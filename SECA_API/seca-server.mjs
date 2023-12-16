import API from './web/api/seca-web-api.mjs'
import SERVICES from './services/seca-services.mjs'
import TICKETMASTER from './ticketmaster/tm-events-data.mjs'
import DATA_ELASTIC from './data/seca-data-elastic.mjs'
import DATA_MEM from './data/seca-data-mem.mjs'
import express from 'express';
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'

var app = express();
export default app;
const swaggerDocument = yaml.load('./docs/seca-api-spec.yaml')
const services = SERVICES(DATA_MEM, DATA_ELASTIC, TICKETMASTER)
const api = API(services)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
const PORT = 2003;
console.log("Starting server");
app.get('/', (req, res) => {
  res.send('Welcome to SECA API!');
});
app.use(express.json())
app.use('/site', express.static('./seca-web-site.js'));
app.get('/event/list', api.getAllPopularEventsList);
app.get('/event/search/:name', api.getEventsByName);
app.get('/event/:id', api.getEventById);
app.put('/group/add', api.addEventToGroup);
app.delete('/group/remove', api.removeEventFromGroup);
app.post('/group', api.createGroup);
app.put('/group', api.editGroup);
app.get('/group/list', api.listAllGroups);
app.get('/group/:id', api.getGroup);
app.delete('/group/:id', api.deleteGroup);
app.post('/user', api.createUser);
app.listen(PORT, (err) => {
  if (err)
    return console.log('Something bad happened', err);
  console.log(`Listening at http://localhost:${PORT}`);
});