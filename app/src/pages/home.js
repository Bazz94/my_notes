import * as React from 'react';
import { Typography, Container, Divider } from "@mui/material";
import { useEffect } from 'react';
import useState from 'react-usestateref';
import NoteListComponent from '../components/noteList.js';
import TagListComponent from '../components/tagList.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import NoteDialog from './noteDialog.js';
import TagDialog from './tagDialog.js';
import { useNavigate } from "react-router-dom";
import Fab from '@mui/material/Fab';
import SettingsIcon from '@mui/icons-material/Settings';
import LoadingComponent from '../components/loading.js'


export default function Home() {
  const navigate = useNavigate();

  const userLoggedIn = localStorage.getItem("authenticated");
  if (!userLoggedIn) {
    navigate("/login");
  }

  const [receivedNotes, setReceivedNotes] = useState(false);
  const [receivedTags, setReceivedTags] = useState(false);
  useEffect(() => {
    fetch('http://localhost:8000/users/1')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setNoteList(data.notes);
        setFilterNoteList(data.notes);
        setReceivedNotes(true);
      });

    fetch('http://localhost:8000/tags')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setTagList(data);
        setReceivedTags(true);
      });
  }, []);

  // NoteListComponent methods
  const [noteList, setNoteList] = useState([]);
  const [filterNoteList, setFilterNoteList, filterNoteListRef] = useState([]);
  const [titleValue, setTitle] = useState('');
  const [contentValue, setContent] = useState('');
  const [idValue, setId] = useState(null);
  const [noteTags, setNoteTags, noteTagsRef] = useState([]);

  function handleNoteClick(id) {
    const note = noteList.find(note => note.id === id);
    setId(id);
    setTitle(note.title);
    setContent(note.content);
    setNoteTags(note.tags);
    setNoteOpen(true);
  }

  // NoteDialogComponent methods
  const [openNote, setNoteOpen] = useState(false);
  
  // TagListComponentComponent methods
  const [tagList, setTagList] = useState([]);
  
  // TagDialogComponent methods
  const [tagOpen, setTagOpen] = useState(false);
  const [tagName, setTagName] = useState('');

  useEffect(() => {
    console.log('noteList changed');
  }, [noteList]);

  useEffect(() => {
    console.log('noteTags changed ', noteTags);
  }, [noteTags]);

  const [showLogOut, setShowLogOut, showLogOutRef] = useState(false);

  const handleLogOut = () => {
    localStorage.setItem("authenticated", false);
    localStorage.setItem("user-id", null);
    navigate('/login');
  }

  return !(receivedNotes && receivedTags) ? (<LoadingComponent/>) : (
      <Container maxWidth="false"
        sx={{ 
          width: 'clamp(350px,80%,60rem)', 
          minHeight: '100vh', // weird
          padding: '1rem',
        }}>
        <Box>
          <Box sx={{
            position: 'relative',
            top: '4.9rem',
            left: '0rem',
          }}>
            <Fab size="small" 
              aria-label="edit" 
              sx={{marginRight: '10px'}}
              onClick={() => setShowLogOut(!showLogOutRef.current)}
              >
              <SettingsIcon />
            </Fab>
            <Fab 
              variant="extended" 
              size="small" 
              aria-label="edit"
              onClick={handleLogOut}
              sx={{ display: showLogOut ? '' : 'none' }}>
              Log out
            </Fab>
          </Box>
          <Typography 
            variant="h1" 
            sx={{margin: '1rem', textAlign: 'center'}}>
            My Notes
          </Typography>
        </Box>
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ minHeight: '58.2vh'}}>
          <Box 
            sx={{ width: '20%' }}>
          <TagListComponent 
            tagList={tagList} 
            filterNoteListRef={filterNoteListRef}
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
            handleNoteClick={handleNoteClick}
            />
          </Box>
        </Stack>
      <NoteDialog 
        openNote={openNote} 
        setNoteOpen={setNoteOpen}
        tagList={tagList}
        noteList={noteList}
        setNoteList={setNoteList}
        titleValue={titleValue}
        setTitle={ setTitle}
        contentValue={ contentValue}
        setContent={setContent }
        idValue={ idValue}
        setId={ setId}
        noteTags={noteTags }
        setNoteTags={setNoteTags}
        noteTagsRef={noteTagsRef}
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