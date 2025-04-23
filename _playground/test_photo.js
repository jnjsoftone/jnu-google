import { GooglePhoto } from '../esm/googlePhoto.js';

const googlePhoto = new GooglePhoto({
  user: 'bigwhitekmc',
});

const client = await googlePhoto.init();
const albums = await googlePhoto.getAlbums();
console.log(JSON.stringify(albums));
