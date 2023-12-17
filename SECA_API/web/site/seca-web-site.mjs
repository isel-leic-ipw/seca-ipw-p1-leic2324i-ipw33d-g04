import { group } from 'console'
import { json } from 'express'
import url from 'url'
import crypto from 'crypto'
const currentDir = url.fileURLToPath(new URL('.', import.meta.url))
let authentication = false

export default function (services) {
  return {
    getAllPopularEventsList: processRequest(getAllPopularEventsList),
    getEventsByName: processRequest(getEventsByName),
    getEventById: processRequest(getEventById),
    createGroup: processRequest(createGroup),
    editGroup: processRequest(editGroup),
    deleteGroup: processRequest(deleteGroup),
    addEventToGroup: processRequest(addEventToGroup),
    removeEventFromGroup: processRequest(removeEventFromGroup),
    listAllGroups: processRequest(listAllGroups),
    getGroup: processRequest(getGroup),
  }

  function processRequest(reqProcessor) {
    return async function(req, rsp) {
        const token =  getToken(req)
        if(!token) {
            rsp
                .status(401)
                .json({error: `Invalid authentication token`})
        }
        try {
            return await reqProcessor(req, rsp)
        } catch (e) {
            const rspError = errorToHttp(e)
            rsp.status(rspError.status).json(rspError.body)
            console.log(e)
        }
    }
}

  async function getHome (request, response) {
    response.render('home', { title: 'Home', home: true, auth: authentication, user:request.user })
  }

  async function getCss (request, response) {
    try {
      const htmlFileLocation = currentDir + 'public/site.css'
      response.sendFile(htmlFileLocation)
    } catch (error) {
      response.status(error.code).send({ error: error.msg })
    }
  }


  // groups
  async function getGroup (request, response) {
    try {
      const id = request.body.id
      const token = request.user.token
      const group = await services.getGroup(id, token)
      return {
        name: 'group',
        data: {
          id: group.id,
          name: group.name,
          description: group.description,
          events: group.movies
        }
      }
    } catch (error) {
      return { name: 'Error', data: error }
    }
  }

  async function createGroup (request, response) {
    try {
      const id = crypto.randomUUID()
      const name = request.body.name
      const description = request.body.description
      const token = request.user.token
      const group = await services.createGroup({ id, name, description }, token)
      return {
        name: 'group',
        data: {
          id: group.id,
          name: group.name,
          description: group.description,
          events: group.movies
        }
      }
    } catch (error) {
      console.log(error)
      return { name: 'Error', data: {msg:error.msg, code: error.code }
    }
  }
}

  async function listAllGroups (request, response) {
    try {
      const token = request.user.token
      const groups = await services.getAllGroups(token)
      return { name: 'allGroups', data: { groups } }
    } catch (error) {
      return { name: 'Error', data: error }
    }
  }

  async function deleteGroup (request, response) {
    try {
      const id = request.body.id
      const token = request.user.token
      await services.deleteGroup(id, token)
      response.redirect('/home/groups')
    } catch (error) {
      return { name: 'Error', data: error }
    }
  }

  async function addEventToGroup (request, response) {
    try {
      const eventid = request.body.movieId
      const groupId = request.body.groupId
      const token = request.user.token 
      const addedEvent = await services.addEventToGroup(groupId, eventid, token)
      return {
        name: 'group',
        data: {
          id: addedEvent.id,
          name: addedEvent.name,
          description: addedEvent.description,
          events: addedEvent.events
        }
      }
    } catch (error) {
      return { name: 'Error', data: error }
    }
  }

  async function removeEventFromGroup (request, response) {
    try {
      const groupid = request.body.groupId
      const eventid = request.body.movieId
      const token = request.user.token 
      const removedEvent = await services.removeEventFromGroup(
        groupid,
        eventid,
        token
      )
      return {
        name: 'group',
        data: {
          id: removedEvent.id,
          name: removedEvent.name,
          description: removedEvent.description,
          events: removedEvent.events
        }
      }
    } catch (error) {
      return { name: 'Error', data: error }
    }
  }
  async function editGroup(req, rsp) {
    const newGroup = {
        title: req.body.title,
        description: req.body.description
    }
    const group = await services.editGroup(req.params.id, newGroup, req.token)
    rsp.redirect("/site/events/")
}


  // events

  async function getAllPopularEventsList (request, response) {
    try {
      const events = await services.getAllPopularEventsList(request.query.nr)
      return { name: 'showMovies', data: { events } }
    } catch (error) {
      return { name: 'Error', data: error }
    }
  }

  async function getEventById (request, response) {
    try {
      const id = request.params.id
      const events = await services.getEventById(id)
      return { name: 'showEvents', data: { events: [events] } }
    } catch (error) {
      return { name: 'Error', data: error }
    }
  }

  async function getEventsByName (request, response) {
    try {
      const movie = request.params.moviename
      const movies = await services.getEventsByName(movie, request.query.nr)
      return { name: 'showMovies', data: { movies } }
    } catch (error) {
      return { name: 'Error', data: error }
    }
  }

}