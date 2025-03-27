import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth, onIdTokenChanged, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FinanzasService, Transaccion } from '../../services/finanzas.service';
import { FormsModule } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';


interface Transaccion1 {
  id?: string,
  descripcion: string,
  monto: number,
  tipo: 'Ingreso' | 'Gasto';
  categoria: string;
  fecha: Date;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  transacciones: Transaccion[] = [];
  // transacciones1: Transaccion1[] = [];
  transaccionesFiltradas: Transaccion1[] = [];
  ingresos = 0;
  gastos = 0;
  saldo = 0;

  filtros = {
    descripcion: '',
    categoria: '',
    fechaInicio: '',
    fechaFin: ''
  }

  constructor(
    private auth: Auth,
    private router: Router,
    private finanzas: FinanzasService,
    private firestore: Firestore
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

  }

  async agregarTransaccion(){
    const descripcion = prompt('Descripcion de la transaccion: ');
    const monto = parseFloat(prompt('Monto:') || '0');
    const tipo = confirm('Es un ingreso? ') ? 'Ingreso' : 'Gasto';
    const categoria = confirm('Que categoria es: ') ? 'Verduras' : 'Chuches';
    const fecha = new Date();

    if(!isNaN(monto) && descripcion){
      const nuevaTransaccion: Transaccion = { descripcion, monto, tipo, categoria, fecha };
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

  filtrarTransacciones(){
    console.log('entrar');
    
    this.transaccionesFiltradas = this.transacciones.filter(transaccion => {
      const coincideDescripcion = transaccion.descripcion
        .toLowerCase()
        .includes(this.filtros.descripcion.toLowerCase());


        const coincideCategoria = !this.filtros.categoria || transaccion.categoria  === this.filtros.categoria;
        const coincideFechaInicio = !this.filtros.fechaInicio || new Date(transaccion.fecha) >= new Date(this.filtros.fechaInicio);
        const coincideFechaFin = !this.filtros.fechaFin || new Date(transaccion.fecha) <= new Date(this.filtros.fechaFin);

        return coincideDescripcion && coincideCategoria && coincideFechaInicio && coincideFechaFin;
    });
  }



}
