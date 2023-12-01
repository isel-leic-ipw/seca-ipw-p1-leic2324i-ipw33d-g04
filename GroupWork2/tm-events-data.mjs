import './seca-data-mem.mjs';
import fetch from 'node-fetch';
import errors from './errors.mjs';

const API_KEY = 'YfmQlHOLFgYdtMQaFbAK7noAe283pmaV';

export async function getAllPopularEventsList(s, p) {
  const events = await _getEvents(s, p, null, "popular")
  return formatEventsDetails(await fetchEventDetails(events))
}

export async function getEventsByName(name, s, p) {
  const events = await _getEvents(s, p, name)
  return formatEventsDetails(await fetchEventDetails(events))
}

export async function getEventsById(eventId) {
  const event = await fetch(`https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${API_KEY}`);
  return formatEventDetails(await fetchSingleEventDetails(event))
}

async function _getEvents(s, p, name = null, type = "name") {
  const format_fetch = type == "popular" ? "" : `keyword=${name}&` 
  const data = await fetch(`https://app.ticketmaster.com/discovery/v2/events/?${format_fetch}sort=relevance,desc&size=${s}&page=${p}&apikey=${API_KEY}`);
  const eventData = await data.json()
  if (eventData._embedded && eventData._embedded.events)
    return eventData._embedded.events
  throw errors.INVALID_ARGUMENT(`${s}, ${p}`)
}

async function fetchEventDetails(events) {
  console.log(typeof events)
  try {
    return await Promise.all(events);
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
}
async function fetchSingleEventDetails(event) {
  try {
    return await event.json();
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
}

function formatEventsDetails(eventDetails) {
  return eventDetails.map(formatEventDetails);
}

function formatEventDetails(event) {
  return {
    id: event.id,
    name: event.name,
    date: event.dates.start.dateTime,
    segment: event.classifications[0].segment.name,
    genre: event.classifications[0].genre.name,
  };
}


// Teste das funções
/*
async function main() {
  try {
    // const events = await getEventsById(1);
    const events2 = await getEventsById("Z7r9jZ1AdqAfd");
    // console.log(events);
    console.log("-----------------------------------");
    console.log(events2);
  } catch (error) {
    console.error('Error:', error);
  }
}
main()
*/