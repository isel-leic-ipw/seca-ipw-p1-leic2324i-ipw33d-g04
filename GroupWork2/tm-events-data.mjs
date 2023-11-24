import './seca-data-mem.mjs'
import fetch from 'node-fetch';
import errors from './errors.mjs'

export async function getAllPopularEventsList(limit) {
    const data = await fetch(`https://app.ticketmaster.com/discovery/v2/events/?sort=relevance,desc&apikey=${apiKey}`)
    const events = await data.json()
    if (eventData._embedded && eventData._embedded.events){
        return events.items.slice(0, limit)
    }
        throw errors.INVALID()
}

export async function getEventsByName(name, limit) {
    const data = await fetch(`https://app.ticketmaster.com/discovery/v2/events/?keyword=${name}&sort=relevance,desc&apikey=${apiKey}`);
    const eventData = await data.json()
    if (eventData._embedded && eventData._embedded.events) {
      const events = eventData._embedded.events.slice(0, limit);
      return events
    }
      throw errors.INVALID()
}
