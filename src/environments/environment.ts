import { initializeApp } from "@angular/fire/app";
import { getAuth } from "@angular/fire/auth";
import { getFirestore } from "@angular/fire/firestore";

// src/environments/environment.ts
export const environment = {
    firebase: {
      apiKey: "AIzaSyDpkGziNZ86cy1QXwH21T7CRiOvL-kZ6bE",
      authDomain: "finanzasapp-e4ed3.firebaseapp.com",
      projectId: "finanzasapp-e4ed3",
      storageBucket: "finanzasapp-e4ed3.firebasestorage.app",
      messagingSenderId: "953370151093",
      appId: "1:953370151093:web:098ebadabb05cd742c56fc",
      measurementId: "G-K9ZRW2QL6G"
    },
    production: false
  };
  
  // const app = initializeApp(environment.firebase);
  // export const auth = getAuth(app);
  // export const db = getFirestore(app)