import { GoogleGmail } from '../esm/googleGmail.js';

const googleGmail = new GoogleGmail({
  user: 'bigwhitekmc',
});

const client = await googleGmail.init();
const gmails = await googleGmail.listGmails();
console.log(JSON.stringify(gmails));
