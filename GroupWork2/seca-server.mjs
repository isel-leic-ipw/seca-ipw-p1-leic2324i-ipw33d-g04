import './seca-web-api.mjs'
import express from 'express';
var app = express();

const PORT = 2003;
console.log(" Starting server on port", PORT);
app.get('/', (req, res) => {
  res.send('Welcome to the SECA API');
});

app.get('/events/list/:s/:p', getPopularEvents);
app.get('/events/search/:s/:p', getEventNames);
app.post('/group/create', createGroups);
app.put('/group/edit', editGroups);
app.get('/group/list', listGroups);
app.delete('/group/delete', deleteGroups);
app.put('/group/add_events', addEvents);
app.delete('/group/remove_events', removeEvents);
app.post('/users', users);
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});