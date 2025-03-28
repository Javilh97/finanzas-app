import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth, initializeAuth, browserLocalPersistence } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { environment } from '../environments/environment';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

const app = initializeApp(environment.firebase)
export const db = getFirestore(app)
export const appConfig: ApplicationConfig = {
  providers: [
    provideCharts(withDefaultRegisterables()),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()), 
    provideStore(),    
    provideFirebaseApp(() => app),
    // provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()),
    provideAuth(() => {
      const auth = initializeAuth(getApp(), {
        persistence: browserLocalPersistence
      });
      return auth;
    })
    
  ]
};
