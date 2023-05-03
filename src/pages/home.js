import * as React from 'react';
import { Typography, Container } from "@mui/material";
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NoteListComponent from '../components/noteList.js';
import TagListComponent from '../components/tagList.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import NoteDialog from './noteDialog.js';

var data = [{ title: 'Note 1', content: 'Content 1', id: uuidv4()},
            { title: 'Note 2', content: 'Content 2', id: uuidv4()},
            { title: 'Note 3', content: 'Content 3', id: uuidv4()}];



export default function Notes() {
  var [noteList, setNoteList] = useState([]);
  var [tagList, setTagList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/users/1?notes')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setNoteList(data);
        console.log(data);
      });
  }, [])

  function handleNewNote() {
    noteOpen();
  }

  function handleNoteClick(id) {
    noteOpen();
    console.log(id);
    // Show note data according to id
  }

  // function handleNewTag() {
  //   // Open tag edit popup
  //   tagList.push({ name: 'The Tag', id: uuidv4() });
  //   console.log(tagList);
  //   setTagList(remakeArray(tagList));
  // }

  function handleTag(name) {
    // Filer list by tag name
  }

  function handleEditTags() {
    // Disable tag buttons and allow the name to be edited and tag to be removed
  }

  // Note Dialog
  const [openNote, setNoteOpen] = useState(false);
  const [titleValue, setTitle] = useState('');
  const [contentValue, setContent] = useState('');

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
    noteList.push({ title: titleValue, content: contentValue, id: uuidv4() });
    console.log(noteList);
    setNoteList(remakeArray(noteList));
    // Add to db
    setNoteOpen(false);
    setTitle('');
    setContent('');
  }

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
          <TagListComponent addNote={handleNewNote} editTags={handleEditTags} tags={tagList} handleTag={handleTag} />
          </Box>
          <Box sx={{ width: '80%' }}>
          <NoteListComponent notes={noteList} handleNoteClick={handleNoteClick} />
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
      </Container>
  )
}

function remakeArray(array, from, to) {
  const arr = [...array];
  [arr[from], arr[to]] = [arr[to], arr[from]];
  return arr;
}