import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(
    private firestore: Firestore
  ){

  }

  obtenerTransacciones(): Observable<any[]> {
    const transaccionesRef = collection(this.firestore, 'transacciones');
    return collectionData(transaccionesRef, { idField: 'id' });
  }
  
}
