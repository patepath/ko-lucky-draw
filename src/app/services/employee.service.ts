import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { and } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private _fs: Firestore) { }

  findAll(): Observable<Employee[]> {
    let ref = query(collection(this._fs, 'Employees') , orderBy('code'));
    return collectionData(ref, { idField: 'id' }) as Observable<Employee[]>;
  }

  findById(id: string) {
    return getDoc(doc(this._fs, 'Employees', id)) ;
  }

  findByCode(keyword: string): Observable<Employee[]> {
    let ref = query(collection(this._fs, 'Employees'), where('code', '==', keyword));
    return collectionData(ref, { idField: 'id'}) as Observable<Employee[]>;
  }

  findByName(keyword: string): Observable<Employee[]> {
    let ref = query(collection(this._fs, 'Employees'), where('fullName', '>=', keyword), where('fullName', '<=', keyword + '\uf8ff'), orderBy('fullName'));
    return collectionData(ref, { idField: 'id'}) as Observable<Employee[]>;
  } 

  add(emply: Employee) {
    return addDoc(collection(this._fs, 'Employees'), emply);
  }

  edit(emply: Employee) {
    let emplyIns = doc(this._fs, 'Employees', emply.id);
    let updateData = {
      code: emply.code,
      fullName: emply.fullName,
      isCheck: emply.isCheck,
      present: emply.present
    }

    return updateDoc(emplyIns, updateData);
  }

  remove(emply: Employee) {
    let ref = doc(this._fs, 'Employees', emply.id);
    return deleteDoc(ref)
  }

  checkin(emply: Employee, type: number) {
    let emplyIns = doc(this._fs, 'Employees', emply.id);
    let updateData = { isCheck: true };

    return updateDoc(emplyIns, updateData);
  }

  async isCheckin(emply: Employee): Promise<boolean> {
    let ref = doc(this._fs, 'Employees', emply.id);
    let snap = await getDoc(ref);
    let employee = <Employee>snap.data();

    return employee.isCheck;
  }

}
