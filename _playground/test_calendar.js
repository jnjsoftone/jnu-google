import { GoogleCalendar } from '../esm/googleCalendar.js';

const googleCalendar = new GoogleCalendar({
  user: 'bigwhitekmc',
});

const client = await googleCalendar.init();
// const calendars = await googleCalendar.listCalendars();
// console.log(JSON.stringify(calendars));
const events = await googleCalendar.listEvents();
console.log(JSON.stringify(events));
