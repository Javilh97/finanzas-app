import { Injectable } from '@angular/core';
import { collection, addDoc, deleteDoc, doc, CollectionReference, onSnapshot } from '@firebase/firestore';
import { db } from '../app.config';

export interface Transaccion {
  id?: string,
  descripcion: string,
  monto: number,
  tipo: 'Ingreso' | 'Gasto'
}

@Injectable({
  providedIn: 'root'
})
export class FinanzasService {

  private transaccionesRef: CollectionReference = collection(db, 'transacciones');

  constructor() { }

  obtenerTransacciones(callback: (transacciones: Transaccion[]) => void){
    onSnapshot(this.transaccionesRef, (snapshot) => {
      const transacciones = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaccion[];
      callback(transacciones);
    });
  }

  async agregarTransaccion(transaccion: Transaccion){
    await addDoc(this.transaccionesRef, transaccion);
  }

  async eliminarTransaccion(id: string){
    const docRef = doc(this.transaccionesRef, id);
    await deleteDoc(docRef);
  }

}
