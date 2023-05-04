import * as React from 'react';
import { Typography, Container } from "@mui/material";
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NoteListComponent from '../components/noteList.js';
import TagListComponent from '../components/tagList.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import NoteDialog from './noteDialog.js';
import TagDialog from './tagDialog.js';


export default function Notes() {
  useEffect(() => {
    fetch('http://localhost:8000/users/1')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setNoteList(data.notes);
      });

    fetch('http://localhost:8000/tags')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setTagList(data);
        console.log(data);
      });
  }, [])

  // NoteListComponent methods
  var [noteList, setNoteList] = useState([]);

  function handleNoteClick(id) {
    noteOpen();
    const note = noteList.find(note => note.id === id);
    setTitle(note.title);
    setContent(note.content);
    setId(id);
  }

  function handleNoteDelete(id) {
    const newList = noteList.filter(note => note.id !== id);
    setNoteList(newList);
  }

  // NoteDialogComponent methods
  const [openNote, setNoteOpen] = useState(false);
  const [titleValue, setTitle] = useState('');
  const [contentValue, setContent] = useState('');
  const [idValue, setId] = useState(null);

  const noteOpen = () => {
    setNoteOpen(true);
  };

  const noteCancel = () => {
    setNoteOpen(false);
    setTitle('');
    setContent('');
  };

  function SubmitNote() {
    if (titleValue === '') {
      return false;
    }
    if (idValue !== null) {
      noteList.find(note => note.id === idValue).title = titleValue;
      noteList.find(note => note.id === idValue).content = contentValue;
    } else {
      noteList.push({ title: titleValue, content: contentValue, id: uuidv4() });
    }
    setNoteList(noteList.filter(note => note !== null));
    // Add to db
    setNoteOpen(false);
    setTitle('');
    setContent('');
    setId(null);
  }

  // TagListComponentComponent methods
  var [tagList, setTagList] = useState([]);

  function handleEditTags() {
    setTagOpen(true);
  }

  function handleTag(name) {
    // Filer list by tag name
  }

  // TagDialogComponent methods
  const [tagOpen, setTagOpen] = useState(false);
  const [tagName, setTagName] = useState('');

  return (
      <Container maxWidth="false"  
        sx={{ 
          width: 'clamp(350px,80%,60rem)', 
          minHeight: '100vh', // weird
          padding: '1rem',
        }}>
        <Typography variant="h1" sx={{margin: '1rem', textAlign: 'center'}} >
          My Notes
        </Typography>
        <Stack direction="row" spacing={2} sx={{ minHeight: '58.2vh'}}>
          <Box sx={{ width: '20%' }}>
          <TagListComponent tags={tagList} editTags={handleEditTags} handleTag={handleTag} />
          </Box>
          <Box sx={{ width: '80%' }}>
          <NoteListComponent notes={noteList} handleNoteClick={handleNoteClick} handleNoteDelete={handleNoteDelete} />
          </Box>
        </Stack>
      <NoteDialog 
        openNote={openNote} 
        handleNoteCancel={noteCancel}
        handleNoteOk={SubmitNote}
        titleValue={titleValue}
        setTitle={setTitle}
        contentValue={contentValue}
        setContent={setContent}
      />
      <TagDialog 
        tagOpen={tagOpen}
        setTagOpen={setTagOpen}
        tagList={tagList}
        tagName={tagName}
        setTagName={setTagName}
      />
      </Container>
  )
}