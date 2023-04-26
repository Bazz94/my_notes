import * as React from 'react';
import { Typography, Container } from "@mui/material";
import {useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NoteListComponent from '../components/noteList.js';
import TagListComponent from '../components/tagList.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';



export default function Notes() {
  var [noteList, setNoteList] = useState([]);
  var [tagList, setTagList] = useState([]);


  function addNote() {
    // Open note edit popup
    noteList.push({ title: 'The Title', subtext: 'The subtext', content: 'The contents', id: uuidv4() });
    console.log(noteList);
    setNoteList(remakeArray(noteList));
  }

  function addTag() {
    // Open tag edit popup
    tagList.push({ name: 'The Tag', id: uuidv4() });
    console.log(tagList);
    setTagList(remakeArray(tagList));
  }

  function handleTag(name) {
    // Filer list by tag name
  }

  function editTags() {
    // Disable tag buttons and allow the name to be edited and tag to be removed
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
            <TagListComponent addNote={addNote} editTags={editTags} tags={tagList} handleTag={handleTag} />
          </Box>
          <Box sx={{ width: '80%' }}>
            <NoteListComponent notes={noteList} />
          </Box>
        </Stack>
      </Container>
  )
}

function remakeArray(array, from, to) {
  const arr = [...array];
  [arr[from], arr[to]] = [arr[to], arr[from]];
  return arr;
}