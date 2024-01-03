import { group } from 'console'
import { json } from 'express'
import url from 'url'
import crypto from 'crypto'
import errorToHttp from '../../errors/errors-to-http.mjs'

const currentDir = url.fileURLToPath(new URL('.', import.meta.url))

const DEFAULT_S = 30
const DEFAULT_P = 1
export default function (services) {
  if(!services)
      throw errors.INVALID_ARGUMENT("Services")
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
      //This is a way to  give authorization due to HTTP stateless, it can't save state among requests
      //This token was generated in the createUser function so you're free to change it
      req.headers.authorization =  'Bearer ' + 'dd5e434b-b55d-4b39-bac5-2c9c8664c5ee'
      // console.log(req.headers)
      const token = getToken(req)
      // console.log(token)
      //token returning undefined, so we'll use the one above to check routes
      // req.token = token //
      if(!token) {
          rsp.status(401).json("Not authorized")  
      }
      try {
        return await reqProcessor(req, rsp)
      } catch (e) {
          console.log("Error:")
          console.log(e)
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
    console.log(username)
    if (Object.keys(req.body).length == 0)
      return rsp
        .status(400)
        .render('userInfo', {title: "Error", message: "[WA] No user info was provided. Try again." });
    const add_user = await services.createUser(username)
    const u = await services.listUsers()
    // const token = u.find(u => u._source.name === username)._source.token
    // rsp.set({'Authorization': 'Bearer', token})
    if(add_user) {
      console.log(u)
      // const d =  u[u.length - 1].token}
      const d =  u[u.length - 1]._source.token
      // return rsp.status(201).render({"user-token": d})
      return rsp.status(201).render('userInfo', {title: `User ${username}`, token: d})
    }
    // rsp.setHeader('Authorization', 'Bearer '+ token)
    rsp.status(400).render('userInfo', {title: "Error", message: "User already exists"})
    }

  // groups
  async function _getGroup(req, rsp) {
    const groupId = req.params.id;
    const group = await services.getGroup(groupId, req.token);
    console.log(group) 
    if (group)
      return rsp.render ('group', {title: `Group ${groupId} details`, group: group})
    rsp.render('group', {title: "You don't have groups with this id", message: "Group not found"})
   }

  async function _createGroup(req, rsp) {
    const newGroup = {
      name: req.body.name,
      description: req.body.description
    }
    console.log(newGroup)
    await services.createGroup(newGroup, req.token)
    console.log("newGroup created")
    rsp.redirect("/site/group/list")
  }

  async function _listAllGroups (req, rsp) {
    const allGroups = await services.listAllGroups(req.token);
    console.log("groups:")
    console.log(allGroups)
    if(allGroups)
      return rsp.render('allGroups', {title: "All groups", groups: allGroups})
    rsp.render('allGroups', {title: "You don't have groups", message: "Groups not found"})
  }

  async function _deleteGroup (req, rsp) {
    const groupId = req.body.id
    const token = req.token
    await services.deleteGroup(groupId, token)
    console.log("Group deleted")
    rsp.redirect("/site/group/list")
  }

  async function _addEventToGroup (req, rsp) {
    const eventId = req.body.eventId
    const groupId = req.body.groupId
    await services.addEventToGroup(groupId, eventId, req.token)
    console.log("Event added")
    rsp.redirect("/site/group/list")
  }

  async function _removeEventFromGroup (req, rsp) {
    const eventId = req.body.eventId
    const groupId = req.body.groupId
    await services.removeEventFromGroup(groupId, eventId, req.token)
    console.log("Event removed")
    rsp.redirect("/site/group/list")
  }
  async function _editGroup(req, rsp) {
    const editedGroup = {
      groupId: req.body.groupId,
      newName: req.body.name,
      newDescription: req.body.description
    }
    await services.editGroup(editedGroup, req.token)
    console.log("Group edited")
    rsp.redirect("/site/group/list")
  }

  // events
  async function _getAllPopularEventsList(req, rsp) {
    const events = await services.getAllPopularEventsList(req.token, req.query.s || DEFAULT_S, req.query.p || DEFAULT_P)
    console.log(events)
    return rsp.render('showEvents', {title: "Popular events", events: events})
  }
  
  async function _getEventsByName(req, rsp) {
    const events = await services.getEventsByName(req.params.name, req.token, req.query.s || DEFAULT_S, req.query.p || DEFAULT_P)
    if(events)
      return rsp.render('showEvents', {title: `Event ${req.params.name}`, events: events})
    rsp.status(404).render('showEvents', {title: "Error", message: "Events not found"})
  }
  
  async function _getEventById(req, rsp) {
    const event = await services.getEventById(req.params.id, req.token)
    if(event)
      return rsp.render('showEvents', {title: `Event ${req.params.id} details`, event: event})
    rsp.status(404).render('showEvents', {title: "Error", message: "Event not found"})
  }

  function getToken(req) {
    const BEARER_STR = "Bearer "
    const tokenHeader = req.get("Authorization")
    // console.log(tokenHeader)
    if(!(tokenHeader && tokenHeader.startsWith(BEARER_STR) && tokenHeader.length > BEARER_STR.length)) {
      return null
    }
    req.token = tokenHeader.split(" ")[1]
    return req.token
  } 
}