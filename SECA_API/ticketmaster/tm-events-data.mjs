// import '../data/seca-data-mem.mjs';
import fetch from 'node-fetch';
import errors from '../errors/errors.mjs';

const API_KEY = 'YfmQlHOLFgYdtMQaFbAK7noAe283pmaV';

export default function () {
  return {
    getAllPopularEventsList: getAllPopularEventsList,
    getEventsByName: getEventsByName,
    getEventById: getEventById
  };

  async function getAllPopularEventsList(s, p) {
    const events = await _getEvents(s, p, null, "popular")
    return await formatEventsDetails(await fetchEventDetails(events))
  }

  async function getEventsByName(name, s, p) {
    const events = await _getEvents(s, p, name)
    return await formatEventsDetails(await fetchEventDetails(events))
  }

  async function getEventById(eventId) {
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
    return eventDetails.map(function (event) {
      return {
        id: event.id,
        name: event.name,
        date: event.dates.start.dateTime,
        segment: event.classifications[0].segment.name,
        genre: event.classifications[0].genre.name
      };
    });
  }

  function formatEventDetails(event) {
    return {
      name: event.name,
      Image: event.images[0].url,
      salesStart: event.sales.public.startDateTime,
      salesEnd: event.sales.public.endDateTime,
      date: event.dates.start.dateTime,
      segment: event.classifications[0].segment.name,
      genre: event.classifications[0].genre.name,
      subGenre: event.classifications[0].subGenre.name,
    };
  }
}