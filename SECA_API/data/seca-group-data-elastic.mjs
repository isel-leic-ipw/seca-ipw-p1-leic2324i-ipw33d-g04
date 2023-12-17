//curl -X PUT http://localhost:9200/group

import {get, post, del, put} from './fetch-wrapper.mjs'
import uriManager from './seca-data-elastic.mjs'

export default async function (indexName = 'group') {
    const URI_MANAGER = await uriManager(indexName)

    return {
        getGroup,
        editGroup,
        createGroup,
        deleteGroup
    }

    async function getGroup(groupId, userId){
        const query = {
            query: {
                match: {
                "userId": userId,
                "groupId": groupId
                }
            }
            }
        return post(URI_MANAGER.getAll(), query)
            .then(body => body.hits.hits.map(createGroup))
    }    

    async function getGroupsBody(userId) {
        const query = {
            query: {
              match: {
                "userId": userId
              }
            }
          }
        return post(URI_MANAGER.getAll(), query)
            .then(body => body.hits.hits.map(createGroup)
)
    }

    async function getGroupsQuery(userId) {
        const uri = `${URI_MANAGER.getAll()}?q=userId:${userId}`
        return get(uri)
            .then(body => body.hits.hits.map(createGroup))
    }

    async function getTask(taskId) {
        return get(URI_MANAGER.get(taskId)).then(createGroup)
    }

    async function editGroup(group, userId) {
        return put(URI_MANAGER.update(userId), group)
    }

    async function deleteGroup(taskId) {
        return del(URI_MANAGER.delete(taskId))
            .then(body => body._id)
    }

    function createGroup(group, taskElastic) {
        let newGroup = Object.assign({
            id: taskElastic._id,
            userId: group.userId,
            name: group.name,
            description: group.description,
            events: group.events
        }, taskElastic._source)
        return newGroup
    }
}