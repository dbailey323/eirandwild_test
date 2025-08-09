import fs from 'fs';
import fetch from 'node-fetch';

const token = process.env.BOOKWHEN_TOKEN;
const now = new Date().toISOString();

const pageSize = 10; // keep this small to avoid overload
let allEvents = [];
let pageOffset = 0;

async function fetchPage(offset) {
  const url = `https://api.bookwhen.com/v2/events?after=${now}&page[size]=${pageSize}&page[offset]=${offset}`;
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error fetching events: ${res.status} ${res.statusText}\n${errorText}`);
  }

  const data = await res.json();
  return data;
}

async function fetchAllEvents() {
  try {
    while (true) {
      const data = await fetchPage(pageOffset);
      allEvents = allEvents.concat(data.data);

      if (!data.links || !data.links.next) {
        break; // no more pages
      }
      pageOffset += pageSize;
    }

    fs.writeFileSync('events.json', JSON.stringify({ data: allEvents }, null, 2));
    console.log(`events.json updated successfully. Total events: ${allEvents.length}`);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

await fetchAllEvents();
