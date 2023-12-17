import api from './web/api/seca-web-api.mjs'
import services from './services/seca-services.mjs'
import ticketmaster from './ticketmaster/tm-events-data.mjs'
import group_elastic from './data/seca-group-data-elastic.mjs'
import data_mem from './data/seca-data-mem.mjs'
import express from 'express';
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'

var app = express();
export default app; // para testes

const swaggerDocument = yaml.load('./docs/seca-api-spec.yaml')
const SERVICES = services(data_mem, group_elastic, ticketmaster)
const API = api(SERVICES)

const PORT = 2003;
console.log("Starting server");
app.get('/', (req, res) => {
  res.send('Welcome to SECA API!');
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())
app.use('/site', express.static('./seca-web-site.js'));

app.get('/event/list', API.getAllPopularEventsList);
app.get('/event/search/:name', API.getEventsByName);
app.get('/event/:id', API.getEventById);
app.put('/group/add', API.addEventToGroup);
app.delete('/group/remove', API.removeEventFromGroup);
app.post('/group', API.createGroup);
app.put('/group', API.editGroup);
app.get('/group/list', API.listAllGroups);
app.get('/group/:id', API.getGroup);
app.delete('/group/:id', API.deleteGroup);
app.post('/user', API.createUser);

app.listen(PORT, (err) => {
  if (err)
    return console.log('Something bad happened', err);
  console.log(`Listening at http://localhost:${PORT}`);
});