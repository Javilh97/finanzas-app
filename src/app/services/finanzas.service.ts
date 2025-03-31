import { Injectable } from '@angular/core';
import { collection, addDoc, deleteDoc, doc, CollectionReference, onSnapshot, query, where } from '@firebase/firestore';
import { db } from '../app.config';
import { Auth, user } from '@angular/fire/auth';
import { Observable, switchMap } from 'rxjs';
import { collectionData, Firestore } from '@angular/fire/firestore';

export interface Transaccion {
  id?: string,
  descripcion: string,
  monto: number,
  tipo: 'Ingreso' | 'Gasto',
  fecha: Date
}

@Injectable({
  providedIn: 'root'
})
export class FinanzasService {

  private transaccionesRef: CollectionReference = collection(db, 'transacciones');

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  obtenerTransacciones(callback: (transacciones: Transaccion[]) => void){
    onSnapshot(this.transaccionesRef, (snapshot) => {
      const transacciones = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaccion[];
      callback(transacciones);
    });
  }

  async addTransaction(transaccion: any){
    const user = this.auth.currentUser;
    if(user){
      const transaccionesRef = collection(this.firestore, 'transacciones');
      return addDoc(transaccionesRef, {...transaccion, uid: user.uid});
    } else {
      return Promise.reject(new Error("No se autentico el usuario."))
    }
  }

  getTransaccionesPorUsuario(): Observable<any[]> {
    return user(this.auth).pipe(
      switchMap((user) => {
        if(!user) return [];
        const transaccionesRef = collection(this.firestore, 'transacciones');
        const q = query(transaccionesRef, where('uid', '==', user.uid));
        return collectionData(q, { idField: 'id' })
      })
    )
  }

  async agregarTransaccion(transaccion: Transaccion){
    await addDoc(this.transaccionesRef, transaccion);
  }

  async eliminarTransaccion(id: string){
    const docRef = doc(this.transaccionesRef, id);
    await deleteDoc(docRef);
  }

}
