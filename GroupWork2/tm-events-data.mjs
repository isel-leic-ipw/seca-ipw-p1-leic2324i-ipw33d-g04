import './seca-data-mem.mjs'
import fetch from 'node-fetch';

const KEY = 'SRgOVLFAXnlAaniGoODNS3iGzIXyOqI6';
const URL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${KEY}`;

fetch(URL)
