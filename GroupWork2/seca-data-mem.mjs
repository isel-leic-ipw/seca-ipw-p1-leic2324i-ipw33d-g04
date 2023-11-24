import crypto from 'node:crypto'
// import errors from './errors.mjs'

const USERS = [
  {
      id: 1,
      name: "jj",
      token: "14d72b99-48f6-48d3-94d3-5a4dcfd96c80"
  },
  {
      id: 2,
      name: "roger",
      token: "14d72b99-48f6-48d3-94d3-5a4dcfd96c81"
  }
]

const GROUPS = [
    {
        id: 1,
        name: "name",
        description: "test 123"
    },
    {
        id: 2,
        name: "name2",
        description: "test 456"
    }
]

let nextId = USERS.length+1

let nextGroup = GROUPS.length+1

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

export async function createGroup(group, userId) {
    const existingGroup = GROUPS.find(u => {
        return u.name == group.name
    })
    if(!existingGroup) {
        const createdGroup = {
            id: nextGroup++,
            name: group.name,
            description: group.description
        }
    GROUPS.push(createdGroup)
    return createdGroup
    }
    throw errors.ALREADY_EXISTS("group")
}

export async function editGroup(id, newGroup, userId) {
    const idx = getGroupIdx(id, userId)
    if (newGroup.name) GROUPS[idx].name = newGroup.name
    if (newGroup.description) GROUPS[idx].description = newGroup.description
    return GROUPS[idx]
}

export async function deleteGroup(id, userId) {
    const idx = getGroupIdx(id, userId)
    const group = GROUPS[idx]
    GROUPS.splice(idx,1)[0]
    return group
}

export async function getGroupIdx(id, userId){
    const idx = GROUPS.findIndex(u => u.id === id && u.userId === userId)
    if(idx != -1){
        return idx
    }
    throw errors.NOT_FOUND("id")
}

export async function addEventToGroup(groupId, event, userId) {
    const idx = getGroupIdx(groupId, userId)
    const isEventInGroup = GROUPS[idx].events.some(u => u.id == event.id)
    if (!isEventInGroup) {
        GROUPS[idx].events.push(event)
        return event
    }
    throw errors.ALREADY_EXISTS("event")
}

export async function removeEventFromGroup(groupId, eventId, userId) {
    const groupIdx = getGroupIdx(groupId, userId)
    const eventIdx = GROUPS[groupIdx].events.findIndex(e => e.id === eventId)
    if (eventIdx != -1) {
        const removedEvent = GROUPS[groupIdx].events.splice(eventIdx, 1)[0]
        return removedEvent
    }
    throw errors.NOT_FOUND("eventId")
}
  

export async function listAllGroups() {
    return GROUPS
}

export async function getGroup(groupId){
    const group = GROUPS.find(u => {
        return u.id == groupId
    })
    if(group) {
        return group
    }
    throw errors.NOT_FOUND("groupId")
} 