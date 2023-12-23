import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Present } from '../models/present';
import { limit } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PresentService {

  constructor(private _fs: Firestore) { }

  add(present: Present) {
    //emply.id = doc(collection(this._fs, 'id')).id;
    return addDoc(collection(this._fs, 'Presents'), present);
  }

  edit(present: Present) {
    let presentIns = doc(this._fs, 'Presents', present.id);
    let updateData = {
      order: Number(present.order),
      name: present.name,
      qty: Number(present.qty),
    }

    return updateDoc(presentIns, updateData);
  }

  remove(present: Present) {
    let presentIns = doc(this._fs, 'Presents', present.id);
    return deleteDoc(presentIns)
  }

  findAll(): Observable<Present[]> {
    let ref = query(collection(this._fs, 'Presents'), orderBy('name'));
    return collectionData(ref, { idField: 'id'}) as Observable<Present[]>;
  }

  pickPresent() {
    let rs = query(collection(this._fs, 'Presents'), where('qty', '>', 0));
    return collectionData(rs, { idField: 'id'}) as Observable<Present[]>;
  }

}
