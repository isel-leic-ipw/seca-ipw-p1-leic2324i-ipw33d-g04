    // Module manages application users data.
// In this specific module, data is stored ElasticSearch

import {get, post, del, put} from './fetch-wrapper.mjs'
import uriManager from './seca-data-elastic.mjs'


export default async function (indexName = 'user') {

    const URI_MANAGER = uriManager(indexName)

    // Create the index unconditionally. If the index already exists, nothing happiness
    

    return {
        // addUser,
        getUserByToken,
        getUserByUsername
    }



    async function getUserByToken(token) {
        return getUserBy("token",  token)
    }

    async function getUserByUsername(username) {
        return getUserBy("name", username)
    }

    async function getUserBy(propName, value) {
        const uri = `${URI_MANAGER.getAll()}?q=${propName}:${value}`
        return get(uri)
            .then(body => body.hits.hits.map(createUserFromElastic))
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