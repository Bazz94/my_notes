import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';


export default function NoteDialog({ 
  user_id, openNote, setNoteOpen, tagList, noteList, noteListRef, setNoteList, filterNoteList, 
  setFilterNoteList, titleValue, setTitle, contentValue, setContent, idValue, idValueRef,
  setId, noteTags, setNoteTags, noteTagsRef, setOpenErrorDialog, setError }) {

  const [inputError, setInputError] = useState(false);

  function noteCancel() {
    setTitle('');
    setContent('');
    setId(null);
    setNoteOpen(false);
    setNoteTags([]);
  }; 

  async function handleNoteOk() {

    if (titleValue === '') {
      setInputError(true);
      return false;
    }
    if (idValue !== null) {
      // Update note
      if (noteList.find(note => note._id === idValue).title !== titleValue
        || noteList.find(note => note._id === idValue).content !== contentValue
        || noteList.find(note => note._id === idValue).tags !== noteTags
          ) {
          let data = {
            note_id: idValue,
            title: titleValue,
            content: contentValue,
            tags: noteTags
          }

          // Update db
          await fetch(`http://localhost:8080/notes/${user_id}`, {
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
              noteList.find(note => note._id === idValue).title = titleValue;
              noteList.find(note => note._id === idValue).content = contentValue;
              noteList.find(note => note._id === idValue).tags = noteTags;
              filterNoteList.find(note => note._id === idValue).title = titleValue;
              filterNoteList.find(note => note._id === idValue).content = contentValue;
              filterNoteList.find(note => note._id === idValue).tags = noteTags;
              setNoteList([...noteList]);

              console.log('Notes updated');
            }).catch((err) => {
              setError(err.message);
              setOpenErrorDialog(true);
              return false;
            }
          );
      }
    } else {
      // Create note
      let noteId;
      let data = {
        title: titleValue,
        content: contentValue,
        tags: noteTags
      }

      // Create note in db
      await fetch(`http://localhost:8080/notes/${user_id}`, {
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
          noteId = data;
          const note = { _id: noteId, title: titleValue, content: contentValue, tags: noteTags };
          console.log("data: ", data);
          setId(noteId);
          noteList.unshift(note);
          // Check to see if note can be displayed on filterNoteList
          const selectedTag = tagList.find((item) => item.selected === true);
          if (selectedTag == null) {
            filterNoteList.unshift(note);
          } 
          console.log('is included ',noteTags.includes(selectedTag));
          if (noteTags.includes(selectedTag)){
            filterNoteList.unshift(note);
          }
          setNoteList([...noteList]);
          console.log('Notes created');
        }).catch((err) => {
          setError(err.message);
          setOpenErrorDialog(true);
          return false;
        }
      );
    }

    // Clean up 
    console.log('Note Submitted');
    setInputError(false);
    setTitle('');
    setContent('');
    setId(null);
    setNoteOpen(false);
  }

  function handleClickTag(tag) {
    if (noteTags.find(item => item._id === tag._id) != null) {
      setNoteTags(noteTags.filter(item => item._id !== tag._id));
    } else {
      noteTags.push(tag);
      setNoteTags([...noteTagsRef.current]);
    }
  }

  return (
      <Dialog open={openNote} maxWidth='md' fullWidth={true}>
        <DialogContent>
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
        <Stack direction='row' sx={{padding: '0px 1.5rem'}}>
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
        <DialogActions>
          <Button onClick={noteCancel}>Cancel</Button>
          <Button onClick={handleNoteOk}>Ok</Button>
        </DialogActions>
      </Dialog>
  );
}