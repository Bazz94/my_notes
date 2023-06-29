/* 
  This is the Home page of the app, once a user is signed in then they are sent to this page.
  From here the user can open a dialog to create or edit notes or open a dialog to create or 
  edit tags. 
*/
import { Typography, Container } from "@mui/material";
import { useEffect, useRef, useState, memo, useContext } from 'react';
import { NoteListComponent } from '../components/noteList.js';
import { TagListComponent } from '../components/tagList.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { NoteDialog } from './noteDialog.js';
import { TagDialog } from './tagDialog.js';
import { useNavigate } from "react-router-dom";
import Fab from '@mui/material/Fab';
import SettingsIcon from '@mui/icons-material/Settings';
import LoadingComponent from '../components/loading.js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import useNoteDialogControllerReducer from '../reducers/noteDialogControllerReducer.js';
import useTagDialogControllerReducer from '../reducers/tagDialogControllerReducer.js';
import useNoteListReducer from '../reducers/noteListReducer.js';
import { MyContext } from '../components/provider.js';

export const Home = memo(function Home() {
  if (process.env.REACT_APP_DEV_MODE === 'true') {
    console.log('rendered Home');
  }
  const { user_id, updateUser_id } = useContext(MyContext);
  const isDesktopView = (window.innerHeight / window.innerWidth) < 1.5; 
  const [isLoading, setIsLoading] = useState(true); // used while fetching notes and tags data
  const [backdrop, setBackdrop] = useState(false); // a backdrop is a loading screen that appears when the app is busy
  const errorMessage = useRef(null);
  const redirectToLogin = useRef(false); // for when major errors have occurred and the app cant continue normally
  const navigate = useNavigate();
  const [showLogOutButton, setShowLogOutButton] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  function handleLogOut() {
    updateUser_id(null);
    navigate('/login');
  }

  function handleErrorDialogOk() {
    setOpenErrorDialog(false);
    if (redirectToLogin) {
      handleLogOut();
    }
  }

  // Contains the users notes and handles interactions with them
  const [noteList, noteListDispatch] = useNoteListReducer();
  
  // Contains the users tag list
  const [tagList, setTagList] = useState([]);

  // Contains and handles data displayed on the noteDialog. Also opens and closes the dialog
  const [noteDialogController, noteDialogDispatch] = useNoteDialogControllerReducer();

  // Contains and handles data displayed on the tagDialog. Also opens and closes the dialog
  const [tagDialogController, tagDialogDispatch] = useTagDialogControllerReducer();

  // Get the users note and tag data from db
  useEffect(() => {
    //Check logged in
    if (user_id == null) {
      navigate("/login");
    } else {
      // Get tags
      fetch(`${process.env.REACT_APP_API_URL}/tags/${user_id}`)
        .then((res) => {
          if (!res.ok) {
            throw Error("Server error");
          }
          return res.json();
        }).then((tagListData) => {
          setTagList(tagListData);
          if (process.env.REACT_APP_DEV_MODE === 'true') {
            console.log('Fetched tags for home page');
          }
          // Get notes
          fetch(`${process.env.REACT_APP_API_URL}/notes/${user_id}`)
            .then((res) => {
              if (!res.ok) {
                throw Error("Server error");
              }
              return res.json();
            }).then((noteListData) => {
              noteListDispatch({
                type: 'set',
                list: noteListData
              });
              setIsLoading(false);
              if (process.env.REACT_APP_DEV_MODE === 'true') {
                console.log('Fetched user notes for home page');
              }
            }).catch((err2) => {
              setIsLoading(false);
              redirectToLogin.current = true;
              errorMessage.current = err2.message;
              setOpenErrorDialog(true);
              return false;
            });

        }).catch((err) => {
          setIsLoading(false);
          redirectToLogin.current = true;
          errorMessage.current = err.message;
          setOpenErrorDialog(true);
          return false;
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (<LoadingComponent/>) : (
      <Container maxWidth="false"
        sx={{ 
          width: isDesktopView ? 'clamp(500px,80%,60rem)' : 'clamp(350px, 95%, 60rem)', 
          minHeight: '100vh', // weird
          padding: isDesktopView ? '1rem' : '0.1rem',
        }}
      >
        <Box sx={{ height: isDesktopView ? '' : 'clamp(10%, 35vh, 35hv'}}>
          <Box 
            sx={{
              position: 'relative',
              top: isDesktopView ? '4.9rem' : '3rem',
              left: '0rem',
            }}
          >
            <Fab size="small" 
              aria-label="edit" 
              sx={{ marginRight: isDesktopView ? '10px' : '1px'}}
              onClick={() => setShowLogOutButton(!showLogOutButton)}
            >
            <SettingsIcon />
            </Fab>
            <Fab 
              variant="extended" 
              size="small" 
              aria-label="edit"
              onClick={handleLogOut}
              sx={{ display: showLogOutButton ? '' : 'none' }}>
              Log out
            </Fab>
          </Box>
          <Typography 
            variant="h1" 
            sx={{ 
              margin: isDesktopView ? '2rem' : '1rem 2rem', 
              textAlign: 'center', 
              bottom: isDesktopView ? '' : '2rem', 
              position: isDesktopView ? '' : 'relative' 
            }}
          >
            My Notes 
          </Typography>
        </Box>
        <Stack 
          direction="row" 
          spacing={isDesktopView ? 2 : 1} 
          sx={{ minHeight: '58.2vh'}}
        >
          <Box sx={{ width: '20%' }}>
          <TagListComponent 
            user_id={user_id}
            tagList={tagList} 
            setTagList={setTagList}
            noteList={noteList}
            noteDialogDispatch={noteDialogDispatch} 
            tagDialogDispatch={tagDialogDispatch}
          />
          </Box>
          <Box sx={{ width: '80%' }}>
          <NoteListComponent 
            user_id={user_id}
            noteList={noteList}
            noteListDispatch={noteListDispatch}
            noteDialogDispatch={noteDialogDispatch}
            setOpenErrorDialog={setOpenErrorDialog}
            errorMessage={errorMessage}
            setBackdrop={setBackdrop}
            tagList={tagList} 
          />
          </Box>
        </Stack>
      <NoteDialog 
        user_id={user_id}
        tagList={tagList}
        noteList={noteList}
        noteListDispatch={noteListDispatch}
        noteDialogController={noteDialogController}
        noteDialogDispatch={noteDialogDispatch}
        setOpenErrorDialog={setOpenErrorDialog}
        errorMessage={errorMessage}
        setBackdrop={setBackdrop}
        isDesktopView={isDesktopView}
      />
      <TagDialog 
        user_id={user_id}
        noteList={noteList}
        noteListDispatch={noteListDispatch}
        tagList={tagList}
        setTagList={setTagList}
        setOpenErrorDialog={setOpenErrorDialog}
        error={errorMessage}
        setBackdrop={setBackdrop}
        tagDialogController={tagDialogController}
        tagDialogDispatch={tagDialogDispatch}
      />
      <Dialog open={openErrorDialog} maxWidth='sm' fullWidth={true}>
        <DialogContent>
          <Typography> {errorMessage.current} </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogOk}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.snackbar}}
        open={backdrop}
      >
      <CircularProgress color="inherit"/>
      </Backdrop>
    </Container>
  )
});