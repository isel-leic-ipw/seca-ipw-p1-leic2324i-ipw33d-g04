import './seca-data-mem.mjs';
import fetch from 'node-fetch';
import errors from './errors.mjs';
//import fs from 'fs';
const API_KEY = 'YfmQlHOLFgYdtMQaFbAK7noAe283pmaV';
//const outputFile = 'output.json';

export async function getAllPopularEventsList(s, p) {
  const events = await _getEvents(s, p, null, "popular")
  return formatEventDetails(await fetchEventDetails(events))
}

export async function getEventsByName(name, s, p) {
  const events = await _getEvents(s, p, name)
  return formatEventDetails(await fetchEventDetails(events))
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

// Teste das funções

// async function writeFile(formattedEventDetails) {
//   return new Promise((resolve, reject) => {
//     const outputData = {
//       events: formattedEventDetails,
//     };

//     fs.writeFile(outputFile, JSON.stringify(outputData, null, 2), (err) => {
//       if (err) {
//         console.error('Error writing to output file:', err);
//         reject(err);
//       } else {
//         console.log('Event details written to Async-await-event-details.json');
//         resolve();
//       }
//     });
//   });
// }

async function main() {
  try {
    const events = await getAllPopularEventsList(5, 30);
    const events2 = await getEventsByName("Hamilton", 5, 1);
    console.log(events);
    console.log("-----------------------------------");
    console.log(events2);
  } catch (error) {
    console.error('Error:', error);
  }
}
main()