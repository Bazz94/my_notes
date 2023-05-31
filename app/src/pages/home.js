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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


export default function Home() {
  
  const navigate = useNavigate();
  const isDesktopView = (window.innerHeight / window.innerWidth) < 1.5; 

  const [isLoadingN, setIsLoadingN] = useState(true);
  const [isLoadingT, setIsLoadingT] = useState(true);
  const [backdrop, setBackdrop] = useState(false);
  const [error, setError] = useState(null);


  // NoteListComponent methods
  const [noteList, setNoteList, noteListRef] = useState([]);
  const [filterNoteList, setFilterNoteList, filterNoteListRef] = useState([]);
  const [titleValue, setTitle] = useState('');
  const [contentValue, setContent] = useState('');
  const [idValue, setId, idValueRef] = useState(null);
  const [noteTags, setNoteTags, noteTagsRef] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [created, setCreated] = useState(null);
  const [modified, setModified] = useState(null);

  function handleNoteClick(note) {
    setId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setNoteTags([...note.tags]);
    const formatCreated = new Date(note.created).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    setCreated(formatCreated);
    const formatModified = new Date(note.modified).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    setModified(formatModified);
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
    Cookies.remove('user-id');
    navigate('/login');
  }

  const [openErrorDialog, setOpenErrorDialog] = useState(false);


  function handleErrorDialogOk() {
    setOpenErrorDialog(false);
    if (redirect) {
      Cookies.remove('user-id');
      navigate("/login");
    }
  }
  const [user_id, setUser_id, user_idRef] = useState(null);

  // useEffect
  useEffect(() => {
    //Check logged in
    setUser_id(Cookies.get('user-id'));
    if (user_idRef.current == null) {
      navigate("/login");
    } else {
      // Get data
      fetch(`${process.env.REACT_APP_API_URL}/tags/${user_idRef.current}`)
      .then((res) => {
        if (!res.ok) {
          throw Error("Server error");
        }
        return res.json();
      }).then((data) => {
        setTagList(data);
        setIsLoadingT(false);
        if (process.env.REACT_APP_DEV_MODE === true) {
          console.log('Fetched tags for home page');
        }
        // Get notes
        fetch(`${process.env.REACT_APP_API_URL}/notes/${user_idRef.current}`)
        .then((res) => {
          if (!res.ok) {
            throw Error("Server error");
          }
          return res.json();
        }).then((data2) => {
          setNoteList(data2);
          const selectedTag = data.find((item) => item.selected === true);
          if (selectedTag == null) {
            setFilterNoteList(data2);
          } else {
            let tempList = [];
            for (let note of data2) {
              if (note.tags.find((item) => item._id === selectedTag._id) != null) {
                tempList.push(note);
              }
            }
            setFilterNoteList(tempList);
          }
          setIsLoadingN(false);
          if (process.env.REACT_APP_DEV_MODE === true) {
            console.log('Fetched user notes for home page');
          }
        }).catch((err2) => {
          setIsLoadingT(false);
          setIsLoadingN(false);
          setRedirect(true);
          setError(err2.message);
          setOpenErrorDialog(true);
          return false;
        }
        );
      }).catch((err) => {
        setIsLoadingT(false);
        setIsLoadingN(false);
        setRedirect(true);
        setError(err.message);
        setOpenErrorDialog(true);
        return false;
      }
      );
    }
  }, []);

  return isLoadingN || isLoadingT ? (<LoadingComponent/>) : (
      <Container maxWidth="false"
        sx={{ 
          width: isDesktopView ? 'clamp(500px,80%,60rem)' : 'clamp(350px, 95%, 60rem)', 
          minHeight: '100vh', // weird
          padding: isDesktopView ? '1rem' : '0.1rem',
        }}>
        <Box sx={{ height: isDesktopView ? '' : 'clamp(10%, 35vh, 35hv'}}>
          <Box sx={{
            position: 'relative',
            top: isDesktopView ? '4.9rem' : '3rem',
            left: '0rem',
          }}>
            <Fab size="small" 
              aria-label="edit" 
            sx={{ marginRight: isDesktopView ? '10px' : '1px'}}
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
            sx={{ 
              margin: isDesktopView ? '2rem' : '1rem 2rem', 
              textAlign: 'center', 
              bottom: isDesktopView ? '' : '2rem', 
              position: isDesktopView ? '' : 'relative' }}>
              My Notes 
          </Typography>
        </Box>
        <Stack 
          direction="row" 
        spacing={isDesktopView ? 2 : 1} 
          sx={{ minHeight: '58.2vh'}}>
          <Box 
            sx={{ width: '20%' }}>
          <TagListComponent 
            user_id={user_id}
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
            setBackdrop={setBackdrop}
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
        filterNoteList={filterNoteList}
        setFilterNoteList={setFilterNoteList}  
        filterNoteListRef={filterNoteListRef}
        titleValue={titleValue}
        setTitle={ setTitle}
        contentValue={ contentValue}
        setContent={setContent }
        idValue={ idValue}
        idValueRef={idValueRef}
        created={created}
        modified={modified}
        setModified={setModified}
        setId={ setId}
        noteTags={noteTags }
        setNoteTags={setNoteTags}
        noteTagsRef={noteTagsRef}
        setOpenErrorDialog={setOpenErrorDialog}
        setError={setError}
        setBackdrop={setBackdrop}
        isDesktopView={isDesktopView}
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
        setBackdrop={setBackdrop}
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.snackbar}}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      </Container>
  )
}