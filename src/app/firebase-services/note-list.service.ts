import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})

export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  items$;
  items;

  unsubList;
  unsubSingle;

  firestore: Firestore = inject(Firestore);

  constructor() {

    this.unsubList.onSnapshot(this.getNotesRef(), (list) => {
      list.forEach(list => {
        console.log(list);
      });
    });

    this.unsubSingle.onSnapshot(this.getSingleDocRef('notes', 'FcpnKNXmUcCWUPpx8U6U'), (element) => {
      console.log(element);
    });
    this.unsubList();
    this.unsubSingle();



    this.items$ = collectionData(this.getNotesRef());
    // Ein Dollar Zeichen am Ende der Variblen heisst, dass dies observable ist, es wird auf jede änderung gehört
    this.items = this.items$.subscribe( (list) => {
      list.forEach(element => {
        console.log(element);
      });
    });
    this.items.unsubscribe();
  }
  
  getNotesRef(){
    return collection(this.firestore, 'notes'); // Zugriff auf die Datenbank
    // => collection() Method greift auf die gesamte Datenbank (Collection) zu
  }
  
  getTrashRef(){
    return collection(this.firestore, 'trash'); // Zugriff auf die Datenbank
  }

  getSingleDocRef(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
