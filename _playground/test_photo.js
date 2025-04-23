import { GooglePhoto } from '../esm/googlePhoto.js';
import { saveFileFromUrl } from 'jnu-abc';

const googlePhoto = new GooglePhoto({
  user: 'bigwhitekmc',
});

const client = await googlePhoto.init();
// const albums = await googlePhoto.getAlbums();
// console.log(JSON.stringify(albums));

const items = await googlePhoto.getMediaItems();
// console.log(JSON.stringify(items.mediaItems[0]));
const itemId = items.mediaItems[1].id;
// console.log(`itemId: ${itemId}`);

const photo = await googlePhoto.getMediaItem(itemId);
console.log(`photo.baseUrl: ${photo.baseUrl}`);

saveFileFromUrl('test2.jpg', photo.baseUrl);

// {"id":"AAA2BRUjR_jQcM6t7xs8Q2Wa7dxpLlvvAFX7MVtVwKje84zQEslNdx8-fPsT2A6bRYgsfpTXYUDzi1ksCBJC86HtGOv1YZ3dJQ","productUrl":"https://photos.google.com/lr/photo/AAA2BRUjR_jQcM6t7xs8Q2Wa7dxpLlvvAFX7MVtVwKje84zQEslNdx8-fPsT2A6bRYgsfpTXYUDzi1ksCBJC86HtGOv1YZ3dJQ","baseUrl":"https://lh3.googleusercontent.com/lr/AAJ1LKdXdKWX958jgBPKfLASwzeSM9Wknh34t2pA1sFs9NxBVVeqqSPMZHEFne_mYT-060vQXsEzwkG8IivWpVy03E9vuM2rPKXByGis8HDkWbA7OnMmRjFse85LSWnI06zXUeXUekWqwJM5clGlxdIkEl4aNE5kk4UnI5V33KZs2-v8LsbbFQa50ouYFhf2FD-EzQVRy9A5E0dT6L0AEuEPF4KVLNGWht4VHMgQLVAiBsQzwsjrDxuhHULMYjXPFEFSRWz4olimlNj1QXyM5V3ujw8gPGjzuP7jn4qqmBVZaWYvOSPHppYRImFk-1QOQ7RkyI1LLMw3UFN5pR7l4rZ14Ie1U5YIROyAzvPwaOOIpK81slp6VjDyXLqGU3B033-XzHtKPIb9hGpazwOqUW7VTlBert3IeAbshQg1dAwxJ5FQ2DOd2pQ9q-rak76Po3VUvFvqtXb2Wewo3ichB8fjwGGfq6X1yjDtegm_qQ0N_IF12QGu61gCaa8xeTBK1yaI0U4SVkkasFTsfCgro4Rxw39oQo4NUHBvdfGBkL8z7lEgyEXGUbpHnyA-SeEEWzXKozR7nu7HBzIPQGgc_gNNWe_ZVzHDgSU0_r2cOig-CdQ_Ss8ueM7cloMOgHyKD_zfakUNsT-3-POpyJToRQ7IOl2W978VbmCxV-8ftM1189997lom5He1LqYpQESoWE1Nu7_3gpXLlbo_CvAW1P7zgjG5PeTKMuSvh6Cn6i3wfgZKpf43DLmyk_JwKxu8hwR-odx5EPkXd3XA7J_0Wyv07KnCuZIUeBBx-V6kC1G4ccrpUQtAHeG7M4XQcwvMeNWuWl3l1nYk198zjup672ilL-2r6af2gHE4LAMRJuWg2qfGyt2TIIbYWdmqMaUtMOFrvsDQ3_TZ1SZ-HzwthfDFi0Cmw64Nx1FPk6OBtzwYpDtdp92GG1mMPNaaMbr23xUEtg8Ix-BAaLZUZ7gqop9YluXvToAskK0UgOtWQFGvsiuWytiKtCMZyFq8Mvp3er0eD15mHrjj8ZG3llhipDoDmJ69ebXb_liVTTIfzzUcxvQ12A","mimeType":"image/jpeg","mediaMetadata":{"creationTime":"2023-11-17T00:09:16Z","width":"3024","height":"4032","photo":{"cameraMake":"samsung","cameraModel":"SM-N971N","focalLength":4.3,"apertureFNumber":1.5,"isoEquivalent":500,"exposureTime":"0.033333335s"}},"filename":"20231117_090915.jpg"}
