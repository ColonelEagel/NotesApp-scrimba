import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { onSnapshot, addDoc } from "firebase/firestore";//to keep on the code on async with our code and listen to changes in our firebase database and act accordingly to our local code like deleting request
import { notesCollection } from "./firebase";
export default function App()
{
    const [notes, setNotes] = React.useState([]);//empty array to store our notes
    const [currentNoteId, setCurrentNoteId] = React.useState(notes[0]?.id || "");

    const currentNote =
        notes.find(note => note.id === currentNoteId)
        || notes[0]

    useEffect(() =>
    {
        const unsubscribe = onSnapshot(notesCollection, snapshot =>
        {
            // Sync up our local notes array with the snapshot data
            setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })//it takes 2 parameters 1. the collection we want to listen to 2. the function that will run when the collection changes
    }, []);

    async function createNewNote()
    {
        const newNote = {
            body: "# Type your markdown note's title here",
        };
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id);
    }

    function updateNote(text)
    {
        setNotes((oldNotes) =>
        {
            const newArray = [];
            for (let i = 0; i < oldNotes.length; i++)
            {
                const oldNote = oldNotes[i];
                if (oldNote.id === currentNoteId)
                {
                    // Put the most recently-modified note at the top
                    newArray.unshift({ ...oldNote, body: text });
                } else
                {
                    newArray.push(oldNote);
                }
            }
            return newArray;
        });
    }

    function deleteNote(event, noteId)
    {
        event.stopPropagation();
        setNotes((oldNotes) => oldNotes.filter((note) => note.id !== noteId));
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
