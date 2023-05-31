import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material';



export default function NoteDialog({ 
  user_id, openNote, setNoteOpen, tagList, noteList, noteListRef, setNoteList, filterNoteList, 
  setFilterNoteList, filterNoteListRef, titleValue, setTitle, contentValue, setContent, modified, 
  setModified, idValue, setId, noteTags, setNoteTags, setOpenErrorDialog, setError, setBackdrop, 
  isDesktopView }) {

  const [inputError, setInputError] = useState(false);

  function noteCancel() {
    setTitle('');
    setContent('');
    setId(null);
    setNoteOpen(false);
    setModified(null);
    setNoteTags([]);
  }; 

  async function handleNoteOk() {

    if (titleValue === '') {
      setInputError(true);
      return false;
    }
    if (idValue !== null) {
      // Update note
      const note = noteList.find(note => note._id === idValue);
      if (note.title !== titleValue
        || note.content !== contentValue
        || note.tags !== noteTags
      ) {
        let data = {
          note_id: idValue,
          title: titleValue,
          content: contentValue,
          tags: noteTags
        }

          // Update db
        setBackdrop(true);
        await fetch(`${process.env.REACT_APP_API_URL}/notes/${user_id}`, {
            method: 'PATCH',
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(data)
          })
            .then((res) => {
              if (!res.ok) {
                throw Error(res.message);
              }
              
              return res.json();
            }).then((data) => {
              note.title = titleValue;
              note.content = contentValue;
              note.tags = noteTags;
              note.modified = data;
              const filterNote = filterNoteList.find(note => note._id === idValue);
              filterNote.title = titleValue;
              filterNote.content = contentValue;
              filterNote.tags = noteTags;
              filterNote.modified = data;
              setNoteList([...noteListRef.current]);
              setFilterNoteList([...filterNoteListRef.current]);
              setBackdrop(false);
              if (process.env.REACT_APP_DEV_MODE === true) {
                console.log('Notes updated');
              }
            }).catch((err) => {
              setBackdrop(false);
              setError(err.message);
              setOpenErrorDialog(true);
              return false;
            }
          );
      }
    } else {
      // Create note
      
      let data = {
        title: titleValue,
        content: contentValue,
        tags: noteTags
      }

      // Create note in db
      setBackdrop(true);
      await fetch(`${process.env.REACT_APP_API_URL}/notes/${user_id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then((res) => {
          if (!res.ok) {
            throw Error(res.message);
          }
          return res.json();
        }).then((data) => {
          const newNote = { 
            _id: data._id, 
            title: titleValue, 
            content: contentValue, 
            tags: noteTags, 
            modified: data.modified
          };
          setId(data._id);
          const newNoteList = [newNote, ...noteList]
          // Check to see if note can be displayed on filterNoteList
          const selectedTag = tagList.find((item) => item.selected === true);
          let newFilterNote = [];
          if (selectedTag == null) {
            newFilterNote = [newNote, ...filterNoteList];
          } 
          if (noteTags.includes(selectedTag)){
            newFilterNote = [newNote, ...filterNoteList];
          }
          setNoteList(newNoteList);
          setFilterNoteList(newFilterNote);
          setBackdrop(false);
          if (process.env.REACT_APP_DEV_MODE === true) {
            console.log('Notes created');
          }
        }).catch((err) => {
          setBackdrop(false);
          setError(err.message);
          setOpenErrorDialog(true);
          return false;
        }
      );
    }

    // Clean up 
    setInputError(false);
    setTitle('');
    setContent('');
    setId(null);
    setNoteOpen(false);
    setNoteTags([]);
  }

  function handleClickTag(tag) {
    if (noteTags.find(item => item._id === tag._id) != null) {
      setNoteTags(noteTags.filter(item => item._id !== tag._id));
    } else {
      const newNoteTags = [...noteTags, tag]; 
      setNoteTags(newNoteTags);
    }
  }

  return (
    <Dialog open={openNote} maxWidth='md' fullWidth={true}>
      <DialogContent sx={{padding: isDesktopView ? '' : '0.2rem 0.6rem'}}>
        <TextField
          autoFocus
          margin="normal"
          id="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          size="medium"
          error={inputError}
          value={titleValue}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="content"
          type="text"
          fullWidth
          variant="outlined"
          size="small"
          multiline
          minRows="4"
          value={contentValue}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <Stack direction='row' sx={{ padding: isDesktopView ? '0px 1.5rem' : '0px 0.6rem'}}>
          {tagList.map((tag) => (
            <Chip key={tag._id}
              color='info'
              variant={noteTags.find(item => item._id === tag._id) != null 
                ? "filled" : "outlined"} 
              onClick={() => {
                handleClickTag(tag);
              }}
              label={tag.name}
              sx={{margin: "1px"}}>
            </Chip>
          ))}
        </Stack>
      <Stack direction='row-reverse'>
        <DialogActions>
          <Button onClick={noteCancel}>Cancel</Button>
          <Button onClick={handleNoteOk}>Ok</Button>
        </DialogActions>
        <Box sx={{width: '63%'}}></Box>
        <Stack direction='row-reverse' sx={{ margin: isDesktopView ? '1rem 1.5rem' : '0.4rem 1rem' }}>
          { modified && (
          <Typography sx={{ marginRight: '1rem' }}
            variant="caption" color="common"> Modified {modified}
          </Typography>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
}