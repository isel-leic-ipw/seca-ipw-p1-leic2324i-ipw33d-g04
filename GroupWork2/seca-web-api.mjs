import * as services from './seca-services.mjs'
import * as userData from './seca-data-mem.mjs'
import errorToHttp from './errors-to-http.mjs'

export const getAllPopularEventsList = processRequest(_getAllPopularEventsList)
export const getEventsByName = processRequest(_getEventsByName)
export const createGroup = processRequest(_createGroup)
export const editGroup = processRequest(_editGroup)
export const deleteGroup = processRequest(_deleteGroup)
export const addEventToGroup = processRequest(_addEventToGroup)
export const removeEventFromGroup = processRequest(_removeEventFromGroup)
export const listAllGroups = processRequest(_listAllGroups)
export const getGroup = processRequest(_getGroup)
export const createUser = _createUser
const DEFAULT_S = 30
const DEFAULT_P = 1

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
async function _getAllPopularEventsList(req, rsp) {
  const events = await services.getAllPopularEventsList(req.token, req.query.s || DEFAULT_S , req.query.p || DEFAULT_P)
  return rsp.json(events)
}

async function _getEventsByName(req, rsp) {
  const events = await services.getEventsByName(req.params.name, req.token, req.query.s || DEFAULT_S, req.query.p || DEFAULT_P)
  if(events)
      return rsp.json(events)
  rsp.status(404).json("Event not found")
}

async function _createGroup(req, rsp) {
  const newGroup = {
    name: req.body.name,
    description: req.body.description
  }
  const group = await services.createGroup(newGroup, req.token)
  rsp.status(201).json(group)
}

async function _editGroup(req, rsp) {
  const editedGroup = {
      newName: req.body.newName,
      newDescription: req.body.newDescription
  }
  const groupId = req.params.id;
  const group = await services.editGroup(groupId, editedGroup, req.token)
  rsp.json(group)
}

async function _deleteGroup(req, rsp) {
  const id = req.params.id;
  const groups = await services.deleteGroup(id, req.token);
  rsp.json(groups)
}

async function _addEventToGroup(req, rsp) {  
  const eventId = req.body.eventId
  const groupId = req.body.groupId
  const addedEvent = await services.addEventToGroup(groupId, eventId, req.token)
  rsp.json(addedEvent)
}

async function _removeEventFromGroup (req, rsp) {
  const eventId = req.body.eventId
  const groupId = req.body.groupId
  const removedEvent = await services.removeEventFromGroup(groupId, eventId, req.token)
  rsp.json(removedEvent)
}

async function _listAllGroups(req, rsp) {
  const allGroups = await services.listAllGroups(req.token);
  return rsp.json(allGroups);
}

async function _getGroup(req, rsp) {
  const groupId = req.params.groupId;
  const group = await services.getGroup(groupId, req.token);
  return rsp.json(group)
}

export function _createUser(req, rsp) {
  const username = req.body.name
  if (Object.keys(req.body).length == 0)
    return rsp
      .status(400)
      .json({ message: "[WA] No user info was provided. Try again." });
  if(userData.addUser(username)) {
      const u = userData.listUsers()
      return rsp.status(201).json({"user-token": u[u.length - 1].token})
  } 

  rsp.status(400).json("User already exists")
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
