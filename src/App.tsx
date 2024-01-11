import './App.css';
import { useState,useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Tree } from './Tree';

type Note={
  id: string,
  title: string,
  content: string,
  date: string
}

const App=() => {

  const [notes, setNotes]=useState<
    Note[]
  >([
    // {
    //   id: '2wsd55wsf',
    //   title: 'make merry',
    //   content: 'dance it off or hold it in your hand',
    //   date: '28.12.2023'
    // },
  ])

  const [title,setTitle]=useState('');
  const [content,setContent]=useState('');
  const [date,setDate]=useState('');

  const [selectedNote, setSelectedNote]=useState<Note | null>(null);

  useEffect(()=>{
    const getItem=()=>{
      try{
        const savedNotes2=(localStorage.getItem('notesReact'));
        if(savedNotes2){
          setNotes(JSON.parse(savedNotes2));
        }
      } catch(e){
      }
    }

    getItem();
  },[])

  useEffect(()=>{    
    localStorage.setItem('notesReact', JSON.stringify(notes));
  },[notes])

  const handleNoteClick=(note: Note)=>{
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setDate(note.date);
  }

  const handleUpdateNote= async (event: React.FormEvent)=>{
    event.preventDefault();
    if(!selectedNote){
      return;
    }

    const date2=new Date();

    const updatedNote: Note={
        id: selectedNote.id,
        title: title,
        content: content,
        date: date2.toLocaleDateString()
    }

    const updatedNoteList=notes.map((note)=>
    note.id===selectedNote.id ? updatedNote : note)
    setNotes(updatedNoteList);
    setTitle('');
    setContent('');
    setDate('');
    setSelectedNote(null) 
  }

  const handelCancel=()=>{
    setTitle('');
    setContent('');
    setSelectedNote(null);
  }

  const deleteNote=async (event: React.MouseEvent, 
    noteId: string )=>{
      event.stopPropagation(); //чтоб не было всплытия
      
      const updatedNotes=notes.filter((note)=>
      note.id!==noteId
      )
      setNotes(updatedNotes);
  }


  const handleAddNote=async (event: React.FormEvent)=>{
    event.preventDefault();

    const date2=new Date();
    const newNote: Note={
      id: nanoid(),
      title: title,
      content: content,
      date: date2.toLocaleDateString()
    }

      setNotes([newNote,...notes]);
      setTitle('');
      setContent('');
      setDate('')
  }

  return (
    <div className="app-container">
      <Tree/>
      <div className='form-outer'>
      <form className="note-form"
        onSubmit={(event)=> selectedNote ? 
          handleUpdateNote(event) : handleAddNote(event)
        }
      >
        <input placeholder="Title" 
          value={title}
          onChange={(event)=>{
            setTitle(event.target.value)
          }}
        required>
        
        </input>
        <textarea className='content' placeholder="Content" rows={10}
          value={content}
          onChange={(event)=>{
            setContent(event.target.value)
          }}
        required>
          <small>{date}</small>
        </textarea>
        
        
        {selectedNote ? (
          <div className='edit-buttons'>
            <button type='submit'>
              Save
            </button>
            <button onClick={handelCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add note
        </button>
        )
        }
      </form>    
      </div>
      <div className="notes-grid">
        {notes.map((note) => ( 
          <div className="note-item"
            key={note.id}
            onClick={()=> handleNoteClick(note)}
          >
            <div className="notes-header">
              <button
                onClick={(event)=> deleteNote(event, note.id)}
              >x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <small className='date'>{note.date}</small>
          </div>
        ))}
      </div>


    </div>
  );
}

export default App;
