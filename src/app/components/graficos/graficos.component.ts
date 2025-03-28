import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { TransactionsService } from '../../services/transactions.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataset } from 'chart.js';

@Component({
  selector: 'app-graficos',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.css'
})
export class GraficosComponent implements OnInit {

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  }

  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartData: ChartDataset<'bar'>[] = [
    { data: [], label: 'Ingresos', backgroundColor: 'rgba(75, 192, 192, 0.5)' },
    { data: [], label: 'Gastos', backgroundColor: 'rgba(255, 99, 132, 0.5)' }
  ]

  constructor(
    private transacciones: TransactionsService
  ){}

  ngOnInit(): void {
    this.cargarDatos();
    // this.transacciones.obtenerTransacciones().subscribe(transacciones => {
    //   console.log("Trae los datos de firebase, ", transacciones);
      
    //   this.procesarDatos(transacciones);
    // })
  }

  cargarDatos(){
    this.transacciones.obtenerTransacciones().subscribe(transacciones => {
      const ingresos: { [mes: string]: number } = {};
      const gastos: { [ mes: string]: number } = {};
      console.log("Datos regresados por firebase: ", transacciones);
      
      transacciones.forEach(transaccion => {
        const fecha = new Date(transaccion.fecha);
        const mes = fecha.toLocaleString('es-Es', { month: 'long' });
        console.log("Fecha del registro", transaccion.fecha);
        
        if(transaccion.tipo === 'Ingreso'){
          ingresos[mes] = (ingresos[mes] || 0) + transaccion.monto;
        } else if(transaccion.tipo === 'Gasto'){
          gastos[mes] = (gastos[mes] || 0) + transaccion.monto;
        }
      });
      console.log("Datos obtenidos", ingresos);
      
      this.barChartLabels = Object.keys(ingresos).sort();
      this.barChartData = [
        { data: this.barChartLabels.map(mes => ingresos[mes] || 0 ), label: 'Ingresos' },
        { data: this.barChartLabels.map(mes => gastos[mes] || 0 ), label: 'Gastos' }
      ]

    });
  }

  procesarDatos(transacciones: any[]): void{
    const ingresosPorMes: number[] = new Array(12).fill(0);
    const gastosPorMes: number[] = new Array(12).fill(0);
    console.log("Entra a procesar datos");
    
    transacciones.forEach(transaccion => {
      const fecha = new Date(transaccion.fecha);
      const mes = fecha.getMonth();

      if(transaccion.tipo === 'ingreso'){
        ingresosPorMes[mes] += transaccion.monto;
      } else if(transaccion.tipo === 'gasto'){
        gastosPorMes[mes] += transaccion.monto;
      }
      console.log("Procesa los datos");
      
    });
    console.log("Asigna los datos", ingresosPorMes);
    
    this.barChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril'];
    this.barChartData = [
      { data: ingresosPorMes, label: 'Ingresos', backgroundColor: 'rgba(75, 192, 192, 0.5)' },
      { data: gastosPorMes, label: 'Gastos', backgroundColor: 'rgba(255, 99, 132, 0.5)' }
    ]

  }

}
