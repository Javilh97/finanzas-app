import { inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';


export const authGuard = () => {

  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if(user){
        resolve(true);
      } else{
        router.navigate(['/']);
        resolve(false);
        // console.log('No tienes permitido entrar a esta ruta.');
        
      }
    })
  });
};
