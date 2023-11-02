import './seca-data-mem.mjs'
import { fetch } from 'node-fetch';

const URL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=SRgOVLFAXnlAaniGoODNS3iGzIXyOqI6`;

fetch(URL)
