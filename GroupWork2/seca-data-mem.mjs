import crypto from 'node:crypto'

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

export async function createGroup(group) {
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
    throw errors.GROUP_ALREADY_EXISTS()
}

export async function editGroup(userToken) {

}

export async function deleteGroup(userToken) {
}

export async function addEventToGroup(userToken) {
}

export async function removeEventFromGroup(userToken) {
}

export async function listAllGroups(userToken) {
}

export async function getGroup(groupId, userToken){
    const group = GROUPS.find(u => {
        return u.id == groupId
    })
    if(group) {
        return group
    }
    throw errors.GROUP_NOT_FOUND()
} 