import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, getDocs, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class Report1Service {

  constructor(private _fs: Firestore) { }

  getAllPaticipants(): Observable<Employee[]> {
    let ref = query(collection(this._fs, 'Employees'), where('isCheck', '==', true));
    return collectionData(ref, { idField: 'id' }) as Observable<Employee[]>;
  }

  async getTotalAmount(): Promise<number> {
    let ref = query(collection(this._fs, 'Employees'), where('isCheck', '==', true));
    let snap = await getDocs(ref);
    return snap.docs.length; 
  }

  async getQRCodeAmount(): Promise<number> {
    let ref = query(collection(this._fs, 'Employees'), where('isCheck', '==', true), where('checkType', '==', 1));
    let snap = await getDocs(ref);
    return snap.docs.length; 
  }
}
