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
import passport from 'passport'
import expressSession from 'express-session'
var app = express();
const EVENT_FORMS = ''
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
//const FileStore = fileStore(expressSession)
app.use(expressSession({
  secret: "IPW-33D-495-500-505",
  resave: false,
  saveUninitialized: false
  //store: new FileStore()
}))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use('/site', express.static(`${currentFileDir}/web/site/public`))

// Passport initialization
app.use(passport.session())
app.use(passport.initialize())

passport.serializeUser(serializeUserDeserializeUser)
passport.deserializeUser(serializeUserDeserializeUser)
// authentication
app.use('/auth', verifyAuthenticated)
app.get('/home', homeNotAuthenticated)
app.get('/auth/home', homeAuthenticated)
app.get('/login', loginForm)
app.post('/login', validateLogin)
app.post('/logout', logout)

app.set('view engine', 'hbs')
const viewsDir = path.join(currentFileDir, 'web', 'site', 'views')
app.set('views', viewsDir)

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

app.get('/site/event/list', WEB.getAllPopularEventsList);
app.get('/site/event/search/:name', WEB.getEventsByName);
app.get('/site/event/:id', WEB.getEventById);
app.post('/site/group/add', WEB.addEventToGroup);
app.post('/site/group/remove', WEB.removeEventFromGroup);
app.post('/site/createGroup', WEB.createGroup);
app.post('/site/editGroup', WEB.editGroup);
app.post('/site/deleteGroup', WEB.deleteGroup);
app.get('/site/group/list', WEB.listAllGroups);
app.get('/site/group/:id', WEB.getGroup);
app.post('/site/user', WEB.createUser);

app.listen(PORT, (err) => {
  if (err)
    return console.log('Something bad happened', err);
  console.log(`Listening at http://localhost:${PORT}`);
});

function homeNotAuthenticated(req, rsp) {
  let user = req.user ? req.user.username : "unknown"
  rsp.send(`Login to the application here: <a href="/login">Login</a> or Create an User here: <a href="/site/createUser.html">Create User</a>`)
  rsp.end(`Everybody can reach  this endpoint. Hello ${user}, you are not authenticated.`)
}

function homeAuthenticated(req, rsp) {
  console.log("homeAuthenticated - ", req.user)
  rsp.send(`
  <html>
  <head></head>
  <body>
    <h1>You can only reach here if you are authenticated. Hello ${req.user.username}</h1>
    <form method="POST" action="/logout">
        <input type="submit" value="Logout">
    </form>

    <form method="GET" action="/site/home.html">
        <input type="submit" value="Go to home page">
    </form>  </body>
</html>`)
}

function serializeUserDeserializeUser (user, done) {
  console.log("serializeUserDeserializeUser", user)
  done(null, user)
}

function loginForm(req, rsp) {
  rsp.send(`
  <html>
    <head></head>
    <body>
      <h1>Login</h1>
      <form method="POST" action="/login">
          <p>
          Username: <input type="text" name="username" value="">
          </p>

          <p>
          Token: <input type="text" name="token">
          </p>

          <input type="submit">
      </form>

    </body>
  </html>
  `)
}


function validateLogin(req, rsp) {
  console.log("validateLogin")
  if(validateUser(req.body.username, req.body.token)) {
    const user = {
      username: req.body.username,
      token: req.body.token
    }
    console.log(user)
    req.login(user, () => rsp.redirect('/auth/home'))
  }

  function validateUser(username, token) { 
    return SERVICES.validateUser(username, token)
  }
}


function verifyAuthenticated(req, rsp, next) {
  console.log("verifyAuthenticated", req.user)
  if(req.user) {
    return next()
  }
  rsp.redirect('/login')
}

function logout(req, rsp) {
  req.logout((err) => { 
    rsp.redirect('/home')
  })
}