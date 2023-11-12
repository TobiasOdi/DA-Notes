import { Injectable, inject } from '@angular/core';
import { query, orderBy, limit, where, Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})

export class NoteListService {
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];
  trashNotes: Note[] = [];

  //items$;
  //items;

  unsubNotes;
  unsubTrash;
  unsubMarkedNotes;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
    this.unsubTrash = this.subTrashList();
  }

  async addNote(item: Note, colId: "notes" | "trash") {
    if(item.id) {
       if(colId == "notes") {
        await addDoc(this.getNotesRef(), item).catch(
          (err) => {console.error(err)}
        ).then(
          (docRef) => {console.log('Document written with ID: ', docRef?.id)}
        )
      } else {
        await addDoc(this.getTrashRef(), item).catch(
          (err) => {console.error(err)}
        ).then(
          (docRef) => {console.log('Document written with ID: ', docRef?.id)}
        )
      }
    } else {
      item.id = Math.floor(Math.random() * 1000000).toString();
      if(colId == "notes") {
        await addDoc(this.getNotesRef(), item).catch(
          (err) => {console.error(err)}
        ).then(
          (docRef) => {console.log('Document written with ID: ', docRef?.id)}
        )
      } else {
        await addDoc(this.getTrashRef(), item).catch(
          (err) => {console.error(err)}
        ).then(
          (docRef) => {console.log('Document written with ID: ', docRef?.id)}
        )
      }
  
    }
  };

  async updateNote(note: Note) {
    if(note.id){
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.log(err);}
      );
    }
  };

  getCleanJson(note: Note) {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    }
  }

  getColIdFromNote(note: Note) {
    if(note.type == 'note') {
      return 'notes;'
    } else {
      return 'trash'
    }
  }

  async deleteNote(colId: "notes" | "trash", docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => { console.log(err) }
    );
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
    this.unsubMarkedNotes();
  }

  subNotesList(){
    const q = query(this.getNotesRef(), orderBy('title'), limit(50));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });

      // Mit der docChanges kann man sich die änderungen eines Dokuments auslogen lassen.
      list.docChanges().forEach((change) => {
        if(change.type === "added") {
          console.log("New note: ", change.doc.data());
        }
        if(change.type === "modified") {
          console.log("Modified note: ", change.doc.data());
        }if(change.type === "removed") {
          console.log("Removed note: ", change.doc.data());
        }
      })
    });
  }

  subMarkedNotesList(){
    const q = query(this.getNotesRef(), where("marked", "==", false), limit(50));
    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach(element => {
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
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
