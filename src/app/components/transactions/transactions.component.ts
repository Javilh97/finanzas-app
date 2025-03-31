import { Component, OnInit } from '@angular/core';
import { FinanzasService } from '../../services/finanzas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
  transacciones: any[] = [];

  constructor(
    private finanzas: FinanzasService
  ){

  }

  ngOnInit(): void {
    this.finanzas.getTransaccionesPorUsuario().subscribe( data => {
      this.transacciones = data;
    })
  }

}
