import crypto from 'node:crypto'
import errors from '../errors/errors.mjs'

const USERS = [
  {
      id: 1,
      name: "inacio",
      token: "14d72b99-48f6-48d3-94d3-5a4dcfd96c80"
  },
  {
      id: 2,
      name: "amorim",
      token: "14d72b99-48f6-48d3-94d3-5a4dcfd96c81"
  }
]

const GROUPS = [
    {
        id: 1,
        userId: 1,
        name: "name",
        description: "test 123",
        events: []
    },
    {
        id: 2,
        userId: 1,
        name: "name2",
        description: "test 456",
        events: []
    },
    {
        id: 1,
        userId: 2,
        name: "name3",
        description: "test 789",
        events: []
    },
    {
        id: 2,
        userId: 2,
        name: "name4",
        description: "test 101112",
        events: []
    }
];


let nextId = USERS.length+1

let nextGroup = GROUPS.length + 1


export async function addUser(username) {
    if(!USERS.find(u => u.name == username)) {
        const user = {
            id: nextId++,
            name: username,
            token: crypto.randomUUID()
        }

        USERS.push(user)
        return true
    } 
    return false
}

export async function getUserId(userToken) {
    const user = USERS.find(u => {
        return u.token == userToken
    })
    if(user) {
        return user.id
    }
    throw errors.USER_NOT_FOUND()
}

export async function createGroup(group) {
    const createdGroup = {
        id: nextGroup++,
        userId: group.userId,
        name: group.name,
        description: group.description,
        events: group.events
    }
    GROUPS.push(createdGroup)
    return createdGroup
}

export async function editGroup(newGroup, userId) {
    const idx = await getGroupIdx(newGroup.groupId, userId) 
    if (newGroup.newName) GROUPS[idx].name = await newGroup.newName
    if (newGroup.newDescription) GROUPS[idx].description = await newGroup.newDescription
    return GROUPS.filter(u => u.userId == userId)
}

export async function deleteGroup(id, userId) {
    const idx = await getGroupIdx(id, userId)
    GROUPS.splice(idx,1)
    return GROUPS.filter(u => u.userId == userId)
}

export async function getGroupIdx(id, userId){
    const idx = GROUPS.findIndex(u => u.id == id && u.userId == userId)
    if(idx != -1){
        return idx
    }
    throw errors.NOT_FOUND("id")
}

export async function addEventToGroup(groupId, event, userId) {
    const idx = await getGroupIdx(groupId, userId)
    const isEventInGroup = GROUPS[idx].events.some(u => u.id == event.id)
    if (!isEventInGroup) {
        GROUPS[idx].events.push(event)
        return await event
    }
    throw errors.INVALID_ARGUMENT("Event already exists")
}

export async function removeEventFromGroup(groupId, eventId, userId) {
    const groupIdx = await getGroupIdx(groupId, userId)
    const eventIdx = GROUPS[groupIdx]["events"].find(e => e.id === eventId)
    if (eventIdx != -1) {
        const removedEvent = GROUPS[groupIdx]["events"].splice(eventIdx, 1)[0]
        return removedEvent
    }
    throw errors.NOT_FOUND("eventId")
}
  
export function listAllGroups(userId) {
    return GROUPS.filter(u => u.userId == userId)
}

export function listUsers() {
    return USERS
}

export async function getGroup(groupId, userId){
    const group = GROUPS.find(u => {
        return u.id == groupId
    })
    if(group) {
        return group
    }
    throw errors.NOT_FOUND("groupId")
}