import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth, onIdTokenChanged, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FinanzasService, Transaccion } from '../../services/finanzas.service';
import { GraficosComponent } from "../graficos/graficos.component";

// interface Transaccion {
//   id?: string,
//   descripcion: string,
//   monto: number,
//   tipo: 'Ingreso' | 'Gasto';
// }

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, GraficosComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  transacciones: Transaccion[] = [];
  ingresos = 0;
  gastos = 0;
  saldo = 0;

  constructor(
    private auth: Auth,
    private router: Router,
    private finanzas: FinanzasService
  ){}

  ngOnInit(): void {
    onIdTokenChanged(this.auth, async (user) => {
      if(user){
        const token = await user.getIdTokenResult();
        const tokenExpiration = token.expirationTime;
        const timeToExpire = new Date(tokenExpiration).getTime() - Date.now();

        setTimeout(() => {
          alert('La sesión ha caducado.');
          signOut(this.auth);
          this.router.navigate(['']);
        }, timeToExpire - 5000);

      }
    });

    this.finanzas.obtenerTransacciones((transacciones) => {
      this.transacciones = transacciones;
      this.actualizarResumen();
    })

    // this.finanzas.getTransaccionesPorUsuario().subscribe(data => {
    //   this.transacciones = data;
    // })

  }

  async agregarTransaccion(){
    const descripcion = prompt('Descripcion de la transaccion: ');
    const monto = parseFloat(prompt('Monto:') || '0');
    const tipo = confirm('Es un ingreso? ') ? 'Ingreso' : 'Gasto';
    const fecha = new Date();
    console.log("Fecha ingresda", fecha);
    
    if(!isNaN(monto) && descripcion){
      const nuevaTransaccion: Transaccion = { descripcion, monto, tipo, fecha };
      // this.transacciones.push(nuevaTransaccion);
      await this.finanzas.agregarTransaccion(nuevaTransaccion);
      this.actualizarResumen();
    }

  }

  async eliminarTransaccion(transaccion: Transaccion){
    // this.transacciones = this.transacciones.filter(t => t !== transaccion);
    if(transaccion.id){
      await this.finanzas.eliminarTransaccion(transaccion.id);
    }
    this.actualizarResumen();
  }

  actualizarResumen(){
    this.ingresos = this.transacciones
      .filter(t => t.tipo === 'Ingreso')
      .reduce((acc, t) => acc + t.monto, 0);

    this.gastos = this.transacciones
      .filter(t => t.tipo === 'Gasto')
      .reduce((acc, t) => acc + t.monto, 0);

    this.saldo = this.ingresos - this.gastos;
  }

  async onLogout(){
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
    } catch (error){
      console.log('Error al cerrar sesión.', error);
      
    }
  }

}
