import fs from 'fs';
import fetch from 'node-fetch';

const token = process.env.BOOKWHEN_TOKEN;
const now = new Date().toISOString();

// Build URL with filters: upcoming events only, max 50 per page
const url = `https://api.bookwhen.com/v2/events?after=${now}&page[size]=50`;

try {
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Error fetching events: ${res.status} ${res.statusText}`);
    console.error(`Response: ${errorText}`);
    process.exit(1);
  }

  const data = await res.json();
  fs.writeFileSync('events.json', JSON.stringify(data, null, 2));
  console.log(`events.json updated successfully. Found ${data.data.length} events.`);

} catch (error) {
  console.error('Fetch failed:', error);
  process.exit(1);
}
