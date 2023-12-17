import { group } from 'console'
import { json } from 'express'
import url from 'url'
import crypto from 'crypto'
import errorToHttp from '../../errors/errors-to-http.mjs'

const currentDir = url.fileURLToPath(new URL('.', import.meta.url))

const DEFAULT_S = 30
const DEFAULT_P = 1
export default function (services) {
  return {
    getAllPopularEventsList: processRequest(_getAllPopularEventsList),
    getEventsByName: processRequest(_getEventsByName),
    getEventById: processRequest(_getEventById),
    createGroup: processRequest(_createGroup),
    editGroup: processRequest(_editGroup),
    deleteGroup: processRequest(_deleteGroup),
    addEventToGroup: processRequest(_addEventToGroup),
    removeEventFromGroup: processRequest(_removeEventFromGroup),
    listAllGroups: processRequest(_listAllGroups),
    getGroup: processRequest(_getGroup),
    createUser: _createUser
  }

  function processRequest(reqProcessor) {
    return async function(req, rsp) {
        const token = getToken(req)
        if(!token) {
            rsp.status(401).json("Not authorized")  
        }
        try {
            return await reqProcessor(req, rsp)
        } catch (e) {
            const rspError = errorToHttp(e)
            rsp.status(rspError.status).json(rspError.body)
        }
    }
  }

  // async function getCss (req, rsp) {
  //   try {
  //     const htmlFileLocation = currentDir + '/styles.css'
  //     rsp.sendFile(htmlFileLocation)
  //   } catch (error) {
  //     rsp.status(error.code).send({ error: error.msg })
  //   }
  // }

  async function _createUser(req, rsp) {
    const username = req.body.name
    if (Object.keys(req.body).length == 0)
      return rsp
        .status(400)
        .json({ message: "[WA] No user info was provided. Try again." });
    const add_user = await services.createUser(username)
    if(add_user) {
      const u = await services.listUsers()
      console.log(u)
      // const d =  u[u.length - 1].token}
      const d =  u[u.length - 1]._source.token
      return rsp.status(201).json({"user-token": d})
    } 
    rsp.status(400).json("User already exists")
    }

  // groups
  async function _getGroup(req, rsp) {
    const groupId = req.params.id;
    const group = await services.getGroup(groupId, req.token);
    return rsp.render ('group', {title: `Group ${groupId} details`,group: group})
  }

  async function _createGroup(req, rsp) {
    const newGroup = {
      name: req.body.name,
      description: req.body.description
    }
    const group = await services.createGroup(newGroup, req.token)
    rsp.redirect("/site/group/")
  }

  async function _listAllGroups (req, rsp) {
    const allGroups = await services.listAllGroups(req.token);
    rsp.render('group', {title: "All groups", groups: allGroups})
  }

  async function _deleteGroup (req, rsp) {
    const id = req.body.id
    const token = req.user.token
    const group = await services.deleteGroup(id, token)
    rsp.redirect("/site/group/")
  }

  async function _addEventToGroup (req, rsp) {
    const eventId = req.body.eventId
    const groupId = req.body.groupId
    const addedEvent = await services.addEventToGroup(groupId, eventId, req.token)
    rsp.redirect("/site/group/")
  }

  async function _removeEventFromGroup (req, rsp) {
    const eventId = req.body.eventId
    const groupId = req.body.groupId
    const removedEvent = await services.removeEventFromGroup(groupId, eventId, req.token)
    rsp.redirect("/site/group/")
  }
  async function _editGroup(req, rsp) {
    const newGroup = {
        title: req.body.title,
        description: req.body.description
    }
    const group = await services.editGroup(req.params.id, newGroup, req.token)
    rsp.redirect("/site/group/")
  }


  // events
  async function _getAllPopularEventsList(req, rsp) {
    const events = await services.getAllPopularEventsList(req.token, req.query.s || DEFAULT_S , req.query.p || DEFAULT_P)
    rsp.render('events', {title: "Popular events", events: events})
  }
  
  async function _getEventsByName(req, rsp) {
    const events = await services.getEventsByName(req.params.name, req.token, req.query.s || DEFAULT_S, req.query.p || DEFAULT_P)
    if(events)
      rsp.render('events', {title: "Events by name provided", events: events})
    rsp.status(404).json("Event not found")
  }
  
  async function _getEventById(req, rsp) {
    const event = await services.getEventById(req.params.id, req.token)
    rsp.render('event', {title: `Event ${req.params.id} details`, event: event})
  }

  function getToken(req) {
    const BEARER_STR = "Bearer "
    const tokenHeader = req.get("Authorization")
    if(!(tokenHeader && tokenHeader.startsWith(BEARER_STR) && tokenHeader.length > BEARER_STR.length)) {
      return null
    }
    req.token = tokenHeader.split(" ")[1]
    return req.token
  } 
}