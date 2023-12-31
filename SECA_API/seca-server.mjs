import api from './web/api/seca-web-api.mjs'
import services from './services/seca-services.mjs'
import ticketmaster from './ticketmaster/tm-events-data.mjs'
import group_elastic from './data/seca-group-data-elastic.mjs'
import data_mem from './data/seca-data-mem.mjs'
import web from './web/site/seca-web-site.mjs'
import express from 'express';
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'
import url from 'url'
import cors from 'cors'
import path from 'path'
import hbs from 'hbs'
var app = express();
export default app; // para testes
const currentFileDir = url.fileURLToPath(new URL('.', import.meta.url));
const swaggerDocument = yaml.load(`${currentFileDir}/docs/seca-api-spec.yaml`)
const SERVICES = services(data_mem, group_elastic, ticketmaster)
const API = api(SERVICES)
const WEB = web(SERVICES)
const PORT = 2003;
console.log("Starting server");
app.get('/', (req, res) => {
  res.send('Welcome to SECA API!');
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use('/site', express.static(`${currentFileDir}/web/site/public`))

app.set('view engine', 'hbs')
const viewsDir = path.join(currentFileDir, 'web', 'site', 'views')
app.set('views', viewsDir)
// hbs.registerPartials(path.join(viewsDir, 'partials'))

// web api routes
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
// web site routes
// app.get('/site', (req, res) => {
//   res.sendFile('home.html', { root: `${currentFileDir}/web/site` });
// });

app.get('/site/event/list', WEB.getAllPopularEventsList);
app.get('/site/event/search/:name', WEB.getEventsByName);
app.get('/site/event/:id', WEB.getEventById);
// app.put('/site/group/add', WEB.addEventToGroup);
// app.delete('/site/group/remove', WEB.removeEventFromGroup);
// app.post('/site/group', WEB.createGroup);
// app.put('/site/group', WEB.editGroup);
// app.get('/site/group/list', WEB.listAllGroups);
// app.get('/site/group/:id', WEB.getGroup);
// app.delete('/site/group/:id', WEB.deleteGroup);
app.post('/site/user', WEB.createUser);

app.listen(PORT, (err) => {
  if (err)
    return console.log('Something bad happened', err);
  console.log(`Listening at http://localhost:${PORT}`);
});