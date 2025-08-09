import fs from 'fs';
import fetch from 'node-fetch';

const token = process.env.BOOKWHEN_TOKEN;
const url = 'https://api.bookwhen.com/v2/events';

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${token}` }
});

if (!res.ok) {
  console.error(`Error fetching events: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const data = await res.json();
fs.writeFileSync('events.json', JSON.stringify(data, null, 2));
console.log('events.json updated successfully.');
