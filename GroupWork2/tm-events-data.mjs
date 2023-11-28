import './seca-data-mem.mjs';
import fetch from 'node-fetch';
import errors from './errors.mjs';
import fs from 'fs';
const apiKey = 'YfmQlHOLFgYdtMQaFbAK7noAe283pmaV';
const outputFile = 'output.json';

export async function getAllPopularEventsList(limit) {
    const data = await fetch(`https://app.ticketmaster.com/discovery/v2/events/?sort=relevance,desc&apikey=${apiKey}`)
    const events = await data.json()
    if (events._embedded && events._embedded.events){
        return events._embedded.events.slice(0, limit)
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

async function fetchEventDetails(events) {
  try {
    return await Promise.all(events);
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
}

function formatEventDetails(eventDetails) {
  return eventDetails.map(function (event) {
    return {
      id: event.id,
      name: event.name,
      date: event.dates.start.dateTime,
      segment: event.classifications[0].segment.name,
      genre: event.classifications[0].genre.name,
    };
  });
}

async function writeFile(formattedEventDetails) {
  return new Promise((resolve, reject) => {
    const outputData = {
      events: formattedEventDetails,
    };

    fs.writeFile(outputFile, JSON.stringify(outputData, null, 2), (err) => {
      if (err) {
        console.error('Error writing to output file:', err);
        reject(err);
      } else {
        console.log('Event details written to Async-await-event-details.json');
        resolve();
      }
    });
  });
}

async function main() {
  try {
    const events = await getEventsByName("Phoenix Suns vs. Memphis Grizzlies");
    const eventDetails = await fetchEventDetails(events);
    const formattedEventDetails = formatEventDetails(eventDetails);
    await writeFile(formattedEventDetails);
  } catch (error) {
    console.error('Error:', error);
  }
}

main()