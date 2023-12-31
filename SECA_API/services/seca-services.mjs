import UserElastic from '../data/seca-user-data-elastic.mjs'
import errors from '../errors/errors.mjs'
const USER_ELASTIC = await UserElastic()
export default function(UserGroupData, GroupElastic, eventsData) {
    if(!eventsData)
        throw errors.INVALID_ARGUMENT("events data")   
    return {
        getAllPopularEventsList: getAllPopularEventsList,
        getEventsByName: getEventsByName,
        getEventById: getEventById,
        createGroup: createGroup,
        editGroup: editGroup,
        deleteGroup: deleteGroup,
        addEventToGroup: addEventToGroup,
        removeEventFromGroup: removeEventFromGroup,
        listAllGroups: listAllGroups,
        listUsers: listUsers,
        getGroup: getGroup,
        createUser: createUser
    }

    async function getAllPopularEventsList(userToken, s, p) {
        // const userId = await UserGroupData().getUserId(userToken)
        const userId = await USER_ELASTIC.getUserId(userToken)
        return await _getEvent("popular events", userId, s, p)
    }

    async function getEventsByName(name, userToken, s, p) {
        // const userId = await UserGroupData().getUserId(userToken)
        const userId = await USER_ELASTIC.getUserId(userToken)
        return await _getEvent(name, userId, s, p)
    }

    async function getEventById(eventId, userToken) {
        // const userId = await UserGroupData().getUserId(userToken)
        const userId = await USER_ELASTIC.getUserId(userToken)
        return await eventsData().getEventById(eventId, userId)
    }

    async function createGroup(newGroup, userToken) {
        // const userId = await UserGroupData().getUserId(userToken)
        const userId = USER_ELASTIC.getUserId(userToken)
        const group = {
            userId: userId,
            name: newGroup.name,
            description: newGroup.description,
            events: []     
        }
        return await UserGroupData().createGroup(group)
    }

    async function editGroup(editedGroup, userToken) {
        // const userId = await UserGroupData().getUserId(userToken)
        const userId = USER_ELASTIC.getUserId(userToken)
        return await UserGroupData().editGroup(editedGroup, userId)
    }

    async function deleteGroup(groupId, userToken) {
        // const userId = await UserGroupData().getUserId(userToken);
        const userId = USER_ELASTIC.getUserId(userToken)
        return await UserGroupData().deleteGroup(groupId, userId)
    }

    async function addEventToGroup(groupId, eventId, userToken) {
        // const userId = await UserGroupData().getUserId(userToken)
        const userId = USER_ELASTIC.getUserId(userToken)
        const event = await eventsData().getEventsById(eventId)
        return await UserGroupData().addEventToGroup(groupId, event, userId)
    }

    async function removeEventFromGroup(groupId, eventId, userToken){
        // const userId = await UserGroupData().getUserId(userToken)
        const userId = USER_ELASTIC.getUserId(userToken)
        return UserGroupData().removeEventFromGroup(groupId, eventId, userId)
    }

    async function listAllGroups(userToken){
        // const userId = await UserGroupData().getUserId(userToken)
        const userId = USER_ELASTIC.getUserId(userToken)
        return await UserGroupData().listAllGroups(userId)
    }

    async function getGroup(groupId, userToken){
        // const userId = await UserGroupData().getUserId(userToken)
        const userId = USER_ELASTIC.getUserId(userToken)
        return await UserGroupData().getGroup(groupId, userId)
    }

    async function _getEvent(name, userId, s, p) {
        if(!name) {
            throw errors.INVALID_ARGUMENT("name")
        }
        const event = name == "popular events" ? 
            await eventsData().getAllPopularEventsList(s, p) : 
            await eventsData().getEventsByName(name, s, p)
        if (event)
            return event
        throw errors.NOT_AUTHORIZED(`User ${userId}`, `Event with name ${name}`)
    }

    async function createUser(user) {
        // const d = await UserGroupData().addUser(user)
        const d = await USER_ELASTIC.addUser(user)
        return d
    }

    async function listUsers() {
        // const u = await UserGroupData().listUsers()
        const u = await USER_ELASTIC.listUsers()
        return u
    }
}
