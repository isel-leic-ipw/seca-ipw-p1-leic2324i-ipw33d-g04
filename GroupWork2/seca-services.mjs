import * as eventsData from './tm-events-data.mjs'
import * as UserGroupData from './seca-data-mem.mjs'
// import errors from './errors.mjs'

export async function getAllPopularEventsList(limit) {
    return await eventsData.getAllPopularEventsList(limit)
}

export async function getEventsByName(name) {
    return await _getEvent(name, userId)
}

export async function createGroup(newGroup, userToken) {
    const userId = await UserGroupData.getUserId(userToken)
    const group = {
        name: newGroup.name,
        description: newGroup.description,
        userId: userId
    }
    return await UserGroupData.createGroup(group)
}

export async function editGroup(groupId, editedGroup, userToken) {
    const userId = await usersServices.getUserId(userToken)
    const updatedGroup = {
        newName: editedGroup.newName,
        newDescription: editedGroup.newDescription
    }
    await UserGroupData.editGroup(groupId, updatedGroup, userId)
}

export async function deleteGroup(groupId, userToken) {
    const userId = await UserGroupData.getUserId(userToken)
    await UserGroupData.deleteGroup(groupId, userId)
}

export async function addEventToGroup(groupId, eventName, userToken) {
    const userId = await UserGroupData.getUserId(userToken)
    const event = eventsData.getEventByName(eventName)
    const group = UserGroupData.getGroup(groupId, userId)
    await UserGroupData.addEventToGroup(group, event, userId)
}   

export async function removeEventFromGroup(groupId, eventName, userToken){
    const userId = await UserGroupData.getUserId(userToken)
    const event = eventsData.getEventByName(eventName)
    const group = UserGroupData.getGroup(groupId, userId)
    await UserGroupData.removeEventFromGroup(group, event, userId)
}

export async function listAllGroups(userToken){
    const userId = await UserGroupData.getUserId(userToken)
    await UserGroupData.listAllGroups(userId)
}

export async function getGroup(groupId, userToken){
    const userId = await UserGroupData.getUserId(userToken)
    await UserGroupData.getGroup(groupId, userId)
} 

async function _getEvent(name, userId) {
    if(!name) {
        throw "error"// errors.INVALID_ARGUMENT("name")
    }
    const event = await eventsData.getEventsByName(name)
    if(event && event.userId == userId)
        return event
    throw "error"// errors.NOT_AUTHORIZED(`User ${userId}`, `Event with name ${name}`)
}