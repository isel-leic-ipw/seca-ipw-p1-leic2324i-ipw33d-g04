import * as services from './seca-services.mjs'
import * as userData from './seca-data-mem.mjs'
import errorToHttp from './errors.mjs'


export const getAllPopularEventsList = processRequest(_getAllPopularEventsList)
export const getEventByName = processRequest(_getEventByName)
export const createGroup = processRequest(_createGroup)
export const editGroup = processRequest(_editGroup)
export const deleteGroup = processRequest(_deleteGroup)
export const addEventToGroup = processRequest(_addEventToGroup)
export const removeEventFromGroup = processRequest(_removeEventFromGroup)
export const listAllGroups = processRequest(_listAllGroups)
export const getGroup = processRequest(_getGroup)

function processRequest(reqProcessor) {
  return async function(req, rsp) {
      const token = getToken(req)
      if(!token) {
          rsp.status(401).json("Not authorized")  
      }
      req.token = token
      try {
          return await reqProcessor(req, rsp)
      } catch (e) {
          const rspError = errorToHttp(e) // erros ainda por implementar num ficheiro "errors.js"
          rsp.status(rspError.status).json(rspError.body)
      }
  }
}

async function _getAllPopularEventsList(req, rsp) {
        const events = await services.getAllPopularEventsList(req.token)
        return rsp.json(events)
}

async function _getEventByName(req, rsp) {
        const name = req.params.name
        const event = await services.getEventByName(name, req.token)
        if(event)
            return rsp.json(event)
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
    const id = req.params.id
    const group = services.deleteGroup(id, req.token)
    if(group) {}
    rsp.status(404).json(`Group with id ${id} not found`)
}

async function _addEventToGroup(req, rsp) {  
    const eventId = req.params.eventId
    const groupId = req.params.groupId
    const addedEvent = await services.addEventToGroup(groupId, eventId, req.token)
    return rsp.json(addedEvent)
}

async function _removeEventFromGroup (req, rsp) {
    const groupId = req.params.groupId
    const eventId = req.params.eventId
    const removedEvent = await services.removeEventFromGroup(groupId, eventId, req.token)
    rsp.json(removedEvent)
}

async function _listAllGroups(req, rsp) {
  const allGroups = await services.getAllGroups(req.token);
  return rsp.json(allGroups);
}

async function _getGroup(req, rsp) {
  const groupId = req.params.groupId;
  const group = await services.getGroup(groupId, req.token);
  return rsp.json(group)
}

export function createUser(req, rsp) {
  const username = req.body.username

  if(userData.createUser(username)) {
      return rsp.status(201).json({"user-token": user.token})
  } 

  rsp.status(400).json("User already exists")
}

function getToken(req) {
  const token = req.get("Authorization")
  if(token) {
      return token.split(" ")[1]
  }
}
