import * as React from 'react';
import { Typography, Container } from "@mui/material";
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
import LoadingComponent from '../components/loading.js';
import getFetch from '../requestHandlers.js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';


export default function Home() {
  const navigate = useNavigate();

  const userLoggedIn = localStorage.getItem("loggedIn");
  if (!userLoggedIn) {
    navigate("/login");
  }
  const user_id = localStorage.getItem('user_id');


  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  // NoteListComponent methods
  const [noteList, setNoteList, noteListRef] = useState([]);
  const [filterNoteList, setFilterNoteList, filterNoteListRef] = useState([]);
  const [titleValue, setTitle] = useState('');
  const [contentValue, setContent] = useState('');
  const [idValue, setId, idValueRef] = useState(null);
  const [noteTags, setNoteTags, noteTagsRef] = useState([]);

  const [fatalError, setFatalError] = useState(false);

  function handleNoteClick(id) {
    const note = noteList.find(note => note.id === id);
    setId(id);
    setTitle(note.title);
    setContent(note.content);
    setNoteTags([...note.tags]);
    setNoteOpen(true);
  }

  // NoteDialogComponent methods
  const [openNote, setNoteOpen] = useState(false);
  
  // TagListComponentComponent methods
  const [tagList, setTagList, tagListRef] = useState([]);
  
  // TagDialogComponent methods
  const [tagOpen, setTagOpen] = useState(false);
  const [tagName, setTagName] = useState('');

  const [showLogOut, setShowLogOut, showLogOutRef] = useState(false);

  const handleLogOut = () => {
    localStorage.setItem("authenticated", false);
    localStorage.setItem("user-id", null);
    navigate('/login');
  }

  const [openErrorDialog, setOpenErrorDialog] = useState(false);


  function handleErrorDialogOk() {
    setOpenErrorDialog(false);
    if (fatalError) {
      localStorage.setItem("authenticated", false);
      localStorage.setItem("user-id", null);
      navigate("/login");
    }
  }

  // useEffect
  useEffect(() => {
    getFetch(user_id)
      .then((response) => {
        if (response.error !== false) {
          setFatalError(true);
          setError(response.error);
          setOpenErrorDialog(true);
          setIsLoading(false);
          return false;
        }
        setNoteList(response.data.notes);
        setFilterNoteList(response.data.notes);
        setTagList(response.data.tags);
        setIsLoading(false);
        console.log('Fetched user data for home page');
      });
  }, [setFilterNoteList, setNoteList, setTagList, user_id]);

  return isLoading ? (<LoadingComponent/>) : (
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
            setNoteOpen={setNoteOpen} 
            setTagOpen={setTagOpen}
            filterNoteList={filterNoteList}
            setFilterNoteList={setFilterNoteList}
            />
          </Box>
          <Box 
            sx={{ width: '80%' }}>
          <NoteListComponent 
            user_id={user_id}
            noteList={noteList}
            setNoteList={setNoteList}
            filterNoteList={filterNoteList}
            setFilterNoteList={setFilterNoteList}  
            handleNoteClick={handleNoteClick}
            setOpenErrorDialog={setOpenErrorDialog}
            setError={setError}
            />
          </Box>
        </Stack>
      <NoteDialog 
        user_id={user_id}
        openNote={openNote} 
        setNoteOpen={setNoteOpen}
        tagList={tagList}
        noteList={noteList}
        noteListRef={noteListRef}
        setNoteList={setNoteList}
        titleValue={titleValue}
        setTitle={ setTitle}
        contentValue={ contentValue}
        setContent={setContent }
        idValue={ idValue}
        idValueRef={idValueRef}
        setId={ setId}
        noteTags={noteTags }
        setNoteTags={setNoteTags}
        noteTagsRef={noteTagsRef}
        setOpenErrorDialog={setOpenErrorDialog}
        setError={setError}
      />
      <TagDialog 
        user_id={user_id}
        noteList={noteList}
        noteListRef={noteListRef}
        setNoteList={setNoteList}
        tagOpen={tagOpen}
        setTagOpen={setTagOpen}s
        tagList={tagList}
        tagListRef={tagListRef}
        setTagList={setTagList}
        tagName={tagName}
        setTagName={setTagName}
        setOpenErrorDialog={setOpenErrorDialog}
        setError={setError}
      />
      <Dialog open={openErrorDialog} maxWidth='sm' fullWidth={true}>
        <DialogContent>
          <Typography>
            {error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogOk}>Ok</Button>
        </DialogActions>
      </Dialog>
      </Container>
  )
}