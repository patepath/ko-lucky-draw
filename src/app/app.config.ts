import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"playground-2ed6e","appId":"1:617102270857:web:fe04eb57bb563127dd0158","databaseURL":"https://playground-2ed6e-default-rtdb.asia-southeast1.firebasedatabase.app","storageBucket":"playground-2ed6e.appspot.com","apiKey":"AIzaSyBptn9n8hBWHv3h250zpl_D--U2i-fOhfg","authDomain":"playground-2ed6e.firebaseapp.com","messagingSenderId":"617102270857","measurementId":"G-JPMS75BWNK"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
