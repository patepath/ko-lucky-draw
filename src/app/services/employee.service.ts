import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { and, getDocs, getFirestore } from 'firebase/firestore';
import { Present } from '../models/present';

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

  findParticipants(): Observable<Employee[]> {
    let ref = query(collection(this._fs, 'Employees'), and(where('isCheck', '==', true), where('isDraw', '!=', true), where('isCancel', '==', false)) );
    return collectionData(ref, { idField: 'id' }) as Observable<Employee[]>;
  }

  async add(emply: Employee) {
    await addDoc(collection(this._fs, 'Employees'), emply);
  }

  async edit(emply: Employee) {
    let emplyIns = doc(this._fs, 'Employees', emply.id);
    let updateData = {
      code: emply.code,
      fullName: emply.fullName,
      isCheck: emply.isCheck,
      checkTime: emply.checkTime,
      present: emply.present
    }

    await updateDoc(emplyIns, updateData);
  }

  async remove(emply: Employee) {
    let ref = doc(this._fs, 'Employees', emply.id);
    await deleteDoc(ref)
  }

  async clearCheckin() {
    let updateData = { isCheck: false, checkType: 0, checkTime: '' };
    let ref = collection(this._fs, 'Employees');
    let snap = await getDocs(ref);

    snap.forEach(async s => {
      await updateDoc(doc(this._fs, 'Employees', s.id), updateData);
    });
  }

  async clearLuckyDraw() {
    let updateEmployee = { present: '', isDraw: false, isCancel: false };
    let ref = collection(this._fs, 'Employees');
    let snap = await getDocs(ref);

    snap.forEach(async s => {
      await updateDoc(doc(this._fs, 'Employees', s.id), updateEmployee);
    });
  }

  async checkin(emply: Employee, type: number) {
    let now = new Date();
    let emplyIns = doc(this._fs, 'Employees', emply.id);
    let updateData = { isCheck: true, checkType: type, checkTime: now.toLocaleString() };

    await updateDoc(emplyIns, updateData);
  }

  async isCheckin(emply: Employee): Promise<boolean> {
    let ref = doc(this._fs, 'Employees', emply.id);
    let snap = await getDoc(ref);
    let employee = <Employee>snap.data();

    return employee.isCheck;
  }

  async givePresent(employee: Employee, present: string) {
    let d = doc(this._fs, 'Employees', employee.id);
    let updateData = { isDraw: true, present: present };
    await updateDoc(d, updateData);
  }

  async cancelPresent(employee: Employee, present: Present) {
    updateDoc(doc(this._fs, 'Employees', employee.id), { isDraw: true, present: present.name, isCancel: true });
  }
}
