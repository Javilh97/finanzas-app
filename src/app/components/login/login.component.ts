import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {  
  
  loginForm!: FormGroup;
  errorMessage = '';


  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]],
    });
  }

  async login(){

    if(this.loginForm.invalid){
      this.errorMessage = 'Ingrese los datos solicitados';
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['dashboard']);
    } catch (error){
      this.errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';      
      console.log('Error al iniciar sesión', error);
    }
  }

  goToRegister(){
    this.router.navigate(['register']);
    console.log('Entra');
    
  }

}
