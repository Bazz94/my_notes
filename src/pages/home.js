import * as React from 'react';
import { Typography, Container } from "@mui/material";
import { useState, useEffect } from 'react';
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
        setFilterNoteList(data.notes);
      });

    fetch('http://localhost:8000/tags')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setTagList(data);
      });
  }, [])

  // NoteListComponent methods
  const [noteList, setNoteList] = useState([]);
  const [filterNoteList, setFilterNoteList] = useState([]);

  // NoteDialogComponent methods
  const [openNote, setNoteOpen] = useState(false);
  const [titleValue, setTitle] = useState('');
  const [contentValue, setContent] = useState('');
  const [idValue, setId] = useState(null);
  const [noteTags, setNoteTags] = useState([]);
  

  // TagListComponentComponent methods
  const [tagList, setTagList] = useState([]);

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
        <Typography 
          variant="h1" 
          sx={{margin: '1rem', textAlign: 'center'}} >
          My Notes
        </Typography>
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ minHeight: '58.2vh'}}>
          <Box 
            sx={{ width: '20%' }}>
          <TagListComponent 
            tagList={tagList} 
            setTagList={setTagList}
            noteList={noteList}
            setNoteList={setNoteList}
            setNoteOpen={setNoteOpen} 
            setTagOpen={setTagOpen}
            filterNoteList={filterNoteList}
            setFilterNoteList={setFilterNoteList}
            />
          </Box>
          <Box 
            sx={{ width: '80%' }}>
          <NoteListComponent 
            noteList={filterNoteList} 
            setNoteList={setNoteList} 
            setNoteOpen={setNoteOpen} 
            setTitle={setTitle} 
            setContent={setContent} 
            setId={setId} 
            setNoteTags={setNoteTags}/>
          </Box>
        </Stack>
      <NoteDialog 
        openNote={openNote} 
        setNoteOpen={setNoteOpen}
        titleValue={titleValue}
        setTitle={setTitle}
        contentValue={contentValue}
        setContent={setContent}
        idValue={idValue}
        setId={setId}
        noteTags={noteTags}
        setNoteTags={setNoteTags}
        tagList={tagList}
        noteList={noteList}
        setNoteList={setNoteList}
      />
      <TagDialog 
        tagOpen={tagOpen}
        setTagOpen={setTagOpen}
        tagList={tagList}
        setTagList={setTagList}
        tagName={tagName}
        setTagName={setTagName}
      />
      </Container>
  )
}