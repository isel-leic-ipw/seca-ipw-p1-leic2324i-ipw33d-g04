import './seca-services.mjs'

export function getPopularEventsListByDefault(req, rsp) {
    rsp.end(`GET List Popular Events`)
}

export function getEventNamesByDefault(req, rsp) {
    rsp.end(`GET: Search Event`)
}

export function getPopularEventsList(req, rsp) {
    rsp.end(`GET List Popular Events speficied by page and size`)
}

export function getEventNames(req, rsp) {
    rsp.end(`GET: Search Event speficied by page and size`)
}

export function createGroup(req, rsp) {
    rsp.end(`POST: Create Group with its name and description`)
}

export function editGroup(req, rsp) {
    rsp.end(`PUT: Edit Group changing its name and description`)
}

export function listGroups(req, rsp) {
    rsp.end(`GET: List all Groups`)
}

export function deleteGroup(req, rsp) {
    rsp.end(`DELETE: Delete Group`)
}

export function addEvent(req, rsp) {
    rsp.end(`PUT: Add Event to a group`)
}

export function removeEvent(req, rsp) {
    rsp.end(`DELETE: Remove Event from a Group`)
}

export function createUser(req, rsp) {
    rsp.end(`POST: Create new User given its username`)
}