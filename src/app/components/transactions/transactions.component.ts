import { Component, OnInit } from '@angular/core';
import { FinanzasService, Transaccion } from '../../services/finanzas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit{

  transacciones: Transaccion[] = [];
  totalIngresos: number = 0;
  totalGastos: number = 0;
  balanceGeneral: number = 0;

  constructor(
    private finanzas: FinanzasService
  ){}

  ngOnInit(): void {
    this.finanzas.obtenerTransacciones((transacciones) => {
      this.transacciones = transacciones;
      this.calcularTotales();
    })    
  }

  calcularTotales(): void{
    this.totalIngresos = this.transacciones
      .filter(t => t.tipo === 'Ingreso')
      .reduce((acc, t) => acc + t.monto,0);

    this.totalGastos = this.transacciones
      .filter(t => t.tipo === 'Gasto')
      .reduce((acc, t) => acc +t.monto, 0)

    this.balanceGeneral = this.totalIngresos - this.totalGastos;
  }

}
