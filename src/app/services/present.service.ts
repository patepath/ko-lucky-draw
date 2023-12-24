import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Present } from '../models/present';
import { getDoc, getDocs, limit } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PresentService {

  constructor(private _fs: Firestore) { }

  async add(present: Present) {
    await addDoc(collection(this._fs, 'Presents'), present);
  }

  async edit(present: Present) {
    let presentIns = doc(this._fs, 'Presents', present.id);
    let updateData = {
      order: Number(present.order),
      name: present.name,
      qty: Number(present.qty),
      give: Number(present.give),
      isEmpty: present.isEmpty,
    }

    await updateDoc(presentIns, updateData);
  }

  async clearLuckyDraw() {
    let ref = collection(this._fs, 'Presents');
    let snap = await getDocs(ref)

    snap.docs.forEach(async s => {
      await updateDoc(doc(this._fs, 'Presents', s.id), { give: 0, isEmpty: false})
    });
  }

  async remove(present: Present) {
    let presentIns = doc(this._fs, 'Presents', present.id);
    await deleteDoc(presentIns)
  }

  findAll(): Observable<Present[]> {
    let ref = query(collection(this._fs, 'Presents'), orderBy('name'));
    return collectionData(ref, { idField: 'id'}) as Observable<Present[]>;
  }

  findDrawable(): Observable<Present[]> {
    let rs = query(collection(this._fs, 'Presents'), where('isEmpty', '!=', true));
    return collectionData(rs, { idField: 'id'}) as Observable<Present[]>;
  }

  async pick1(present: Present) {
    let ref = doc(this._fs, 'Presents', present.id);
    let snap = await getDoc(ref);
    let p = <Present>snap.data(); 

    if(p.qty - (p.give+1) <= 0) {
      p.give = p.qty;
      p.isEmpty = true;
    } else {
      p.give++;
      p.isEmpty = false;
    }

    let updateData = {
      give: p.give,
      isEmpty: p.isEmpty
    }

    await updateDoc(ref, updateData);
  }

}
