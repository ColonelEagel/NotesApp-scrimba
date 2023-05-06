import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { onSnapshot, addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";//to keep on the code on async with our code and listen to changes in our firebase database and act accordingly to our local code like deleting request
import { notesCollection, db } from "./firebase";
export default function App()
{
    const [notes, setNotes] = React.useState([]);//empty array to store our notes
    const [currentNoteId, setCurrentNoteId] = React.useState("");

    const currentNote =
        notes.find(note => note.id === currentNoteId) || notes[0]//find the note that matches the currentNoteId and return it or return the first note in the array if no note matches the currentNoteId





    useEffect(() =>
    {
        const unsubscribe = onSnapshot(notesCollection, snapshot =>
        {
            // Sync up our local notes array with the snapshot data
            setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })//it takes 2 parameters 1. the collection we want to listen to 2. the function that will run when the collection changes
    }, []);





    /*Add createdAt and updatedAt properties to the notes
         *    When a note is first created, set the `createdAt` and `updatedAt`
         *    properties to `Date.now()`. Whenever a note is modified, set the
         *    `updatedAt` property to `Date.now()`. */
    
console.log(Date.now())
    //create new note
    async function createNewNote()
    {
        const createdAt=Date.now();
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: createdAt,
        };
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id);
    }


    //set current note 
    useEffect(() =>
    {
        if (!currentNoteId)
        {
            setCurrentNoteId(notes[0]?.id || "");
        }
    }
        , [notes])

    //update note
    async function updateNote(text)
    {
        const docRef = doc(db, "notes", currentNoteId)
        await updateDoc(docRef, { body: text }, { merge: true })
    }

    //delete note
    async function deleteNote(noteId)
    {
        const docRef = doc(db, "notes", noteId)//doc takes 3 parameters 1. the database 2. the collection 3. the id of the document i want to delete
        await deleteDoc(docRef)

    }


    return (
        <main>
            {notes.length > 0 ? (
                <Split sizes={[30, 70]} direction="horizontal" className="split">
                    <Sidebar
                        notes={notes}
                        currentNote={currentNote}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                        deleteNote={deleteNote}
                    />
                    {currentNoteId && notes.length > 0 && (
                        <Editor currentNote={currentNote} updateNote={updateNote} />
                    )}
                </Split>
            ) : (
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button className="first-note" onClick={createNewNote}>
                        Create one now
                    </button>
                </div>
            )}
        </main>
    );
}
