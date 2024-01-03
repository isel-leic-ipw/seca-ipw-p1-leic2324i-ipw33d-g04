//curl -X PUT http://localhost:9200/group

import {get, post, del, put} from './fetch-wrapper.mjs'
import uriManager from './seca-data-elastic.mjs'

export default async function (indexName = 'group') {
    const URI_MANAGER = await uriManager(indexName)

    return {
        getGroup,
        listAllGroups,
        editGroup,
        createGroup,
        deleteGroup,
        addEventToGroup,
        removeEventFromGroup
    }

    async function getGroup(groupId, userId){
        const uri = `${URI_MANAGER.getAll()}?q=id:${groupId}&q=userId:${userId}`
        return await get(uri)
            .then(body => body.hits.hits.map(createGroupFromElastic)[0])
    }    

    async function listAllGroups() {
        const uri = `${URI_MANAGER.getAll()}`
        return await get(uri)
            .then(body => body.hits.hits)
    }

    async function editGroup(group, userId) {
        const g = await getGroup(group.groupId, userId)
        if(!g)
            throw "Group not found"
        return await put(URI_MANAGER.update(g.id), {
                userId: g.userId,
                name: group.newName,
                description: group.newDescription,
                events: g.events
            })
    }

    async function deleteGroup(GroupId) {
        return await del(URI_MANAGER.delete(GroupId))
            .then(body => body._id)
    }

    async function createGroup(group) {
        const uri = `${URI_MANAGER.create()}`
        const newGroup = {
            userId: group.userId,
            name: group.name,
            description: group.description,
            events: [{
                id: null,
                name: null,
                Image: null,
                salesStart: null,
                salesEnd: null,
                date: null,
                segment: null,
                genre: null,
                subGenre: null,
              }]
        }
        console.log("inside createGroup")
        return await post(uri, newGroup)
            .then(body => { newGroup.id = body._id; return newGroup })
        // return await put(URI_MANAGER.createMapping(), {
        //     mappings: {
        //       properties: {
        //         events: {
        //           type: "nested"
        //         }
        //       }
        //     }
        //   })
    }

    async function addEventToGroup(groupId, event, userId){
        const g = await getGroup(groupId, userId)
        if(!g)
            throw "Group not found"
        console.log("oldEvents:", g)
        // const newEvents = g.events
        await g.events.push(event)
        // newEvents.push(event)
        console.log("newEvents:", g)
        const o = {
            userId: g.userId,
            name: g.name,
            description: g.description,
            events: g.events
        }
        EVENTS.push({group: groupId, event: event})
        console.log(o)
        return await put(URI_MANAGER.update(g.id), o) 
    }

    async function removeEventFromGroup(groupId, eventId, userId){
        const g = await getGroup(groupId, userId)
        if(!g)
            throw "Group not found"
        console.log(g.events)
        const event_removed = g.events.filter(prop => prop.id != eventId)
        console.log("remove:", event_removed)
        const o = {
            userId: g.userId,
            name: g.name,
            description: g.description,
            events: event_removed
        }
        console.log(o)
        return await post(URI_MANAGER.update(g.id), o)
    }
    
    function createGroupFromElastic(groupElastic) {
        let group = Object.assign({id: groupElastic._id}, groupElastic._source)
        return group
    }
}