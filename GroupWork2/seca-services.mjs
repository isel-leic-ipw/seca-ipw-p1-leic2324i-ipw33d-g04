import * as eventsData from './tm-events-data.mjs'
import * as UserGroupData from './seca-data-mem.mjs'
import errors from './errors.mjs'

export async function getAllPopularEventsList(userToken, s, p) {
    const userId = await UserGroupData.getUserId(userToken)
    return await _getEvent("popular events", userId, s, p)
}

export async function getEventsByName(name, userToken, s, p) {
    const userId = await UserGroupData.getUserId(userToken)
    return await _getEvent(name, userId, s, p)
}

export async function createGroup(newGroup, userToken) {
    const userId = await UserGroupData.getUserId(userToken)
    const group = {
        userId: userId,
        name: newGroup.name,
        description: newGroup.description,
        events: []          
    }
    return await UserGroupData.createGroup(group)
}

export async function editGroup(groupId, editedGroup, userToken) {
    const userId = await usersServices.getUserId(userToken)
    const updatedGroup = {
        newName: editedGroup.newName,
        newDescription: editedGroup.newDescription
    }
    return await UserGroupData.editGroup(groupId, updatedGroup, userId)
}

export async function deleteGroup(groupId, userToken) {
    const userId = await UserGroupData.getUserId(userToken);
    return await UserGroupData.deleteGroup(groupId, userId)
}

export async function addEventToGroup(groupId, eventId, userToken) {
    const userId = await UserGroupData.getUserId(userToken)
    const event = await eventsData.getEventsById(eventId)
    //const group = await UserGroupData.getGroup(groupId, userToken)
    return await UserGroupData.addEventToGroup(groupId, event, userId)
}

export async function removeEventFromGroup(groupId, eventId, userToken){
    const userId = await UserGroupData.getUserId(userToken)
    return UserGroupData.removeEventFromGroup(groupId, eventId, userId)
}

export async function listAllGroups(userToken){
    const userId = await UserGroupData.getUserId(userToken)
    return await UserGroupData.listAllGroups(userId)
}

export async function getGroup(groupId, userToken){
    const userId = await UserGroupData.getUserId(userToken)
    return await UserGroupData.getGroup(groupId, userId)
}

async function _getEvent(name, userId, s, p) {
    if(!name) {
        throw errors.INVALID_ARGUMENT("name")
    }
    const event = name == "popular events" ? 
        await eventsData.getAllPopularEventsList(s, p) : 
        await eventsData.getEventsByName(name, s, p)
    if (event)
        return event
    throw errors.NOT_AUTHORIZED(`User ${userId}`, `Event with name ${name}`)
}