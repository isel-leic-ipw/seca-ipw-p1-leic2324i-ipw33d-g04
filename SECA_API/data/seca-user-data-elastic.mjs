    // Module manages application users data.
// In this specific module, data is stored in ElasticSearch

import {get, post, del, put} from './fetch-wrapper.mjs'
import uriManager from './seca-data-elastic.mjs'
import crypto from 'node:crypto'

export default async function (indexName = 'user') {

    const URI_MANAGER = await uriManager(indexName)

    // Create the index unconditionally. If the index already exists, nothing happiness
    
    return {
        addUser,
        listUsers,
        getUserId
    }

    async function addUser(username) {
        const uri = `${URI_MANAGER.create()}`
        const a = await listUsers()
        if( a == [] || !a.find(u => u._source.name == username)){
            console.log("User not exists yet")
            await post(uri, {name: username, token: crypto.randomUUID()})
            return true
        }
        return false
    }

    async function listUsers() {
        const uri = `${URI_MANAGER.getAll()}`
        return await get(uri)
            .then(body => body.hits.hits)
    }

    async function getUserId(token) {
        return await getUserBy("token",  token)
    }

    // async function getUserByUsername(username) {
    //     return getUserBy("name", username)
    // }

    async function getUserBy(propName, value) {
        const uri = `${URI_MANAGER.getAll()}?q=${propName}:${value}`
        return await get(uri)
            .then(body => body.hits.hits.map(createUserFromElastic)[0].id)
    }

    function createUserFromElastic(taskElastic) {
        let user = Object.assign({id: taskElastic._id}, taskElastic._source)
        return user
    }
    // function createTaskFromElastic(taskElastic) {
    //     let user = Object.assign({
    //         id: taskElastic._id,
    //         userId: taskElastic._source.userId,
    //         name: taskElastic._source.name,
    //     }, taskElastic._source)
    //     return user
    // }
}