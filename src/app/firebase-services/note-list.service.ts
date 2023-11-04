import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})

export class NoteListService {
  normalNotes: Note[] = [];
  trashNotes: Note[] = [];

  //items$;
  //items;

  unsubNotes;
  unsubTrash;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();

  }


/*     this.unsubSingle = onSnapshot(this.getSingleDocRef('notes', 'FcpnKNXmUcCWUPpx8U6U'), (element) => {
      console.log(element);
    });
    this.unsubList();
    this.unsubSingle(); */


/*   this.items$ = collectionData(this.getNotesRef());
    // Ein Dollar Zeichen am Ende der Variblen heisst, dass dies observable ist, es wird auf jede änderung gehört
    this.items = this.items$.subscribe( (list) => {
      list.forEach(element => {
        console.log(element);
      });
    });
    this.items.unsubscribe(); 
 }
 */

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  subNotesList(){
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subTrashList(){
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false
    }
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
