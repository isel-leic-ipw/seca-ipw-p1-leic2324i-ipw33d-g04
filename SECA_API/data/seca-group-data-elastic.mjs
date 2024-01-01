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
        deleteGroup
    }

    async function getGroup(groupId, userId){
        // const query = {
        //     query: {
        //         match: {
        //         "id": groupId,
        //         "userId": userId
        //         }
        //     }
        // }
        // return get(URI_MANAGER.getAll(), query)
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
        if(group.userId != userId)
            throw "Not authorized due to userId mismatch"
        return await put(URI_MANAGER.update(group.id), group)
    }

    async function deleteGroup(GroupId) {
        return await del(URI_MANAGER.delete(GroupId))
    }

    async function createGroup(group) {
        const uri = `${URI_MANAGER.create()}`
        console.log("inside createGroup")
        return await post(uri, {
            userId: group.userId,
            name: group.name,
            description: group.description,
            events: group.events
        })
        // let newGroup = Object.assign(taskElastic._source)
        // return newGroup
    }

    function createGroupFromElastic(taskElastic) {
        let group = Object.assign({id: taskElastic._id}, taskElastic._source)
        return group
    }}