import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useState, useEffect} from 'react';
import Stack from '@mui/material/Stack';
import { v4 as uuidv4 } from 'uuid';
import Chip from '@mui/material/Chip';


export default function NoteDialog({ 
  openNote, setNoteOpen, tagList, noteList, setNoteList, titleValue,
  setTitle, contentValue, setContent, idValue, setId, noteTags, setNoteTags, noteTagsRef }) {

  const [inputError, setInputError] = useState(false);

  function noteCancel() {
    setTitle('');
    setContent('');
    setId(null);
    setNoteOpen(false);
  }; 

  function handleNoteOkLocal() {
    if (titleValue === '') {
      setInputError(true);
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
    setInputError(false);
    setTitle('');
    setContent('');
    setId(null);
    setNoteOpen(false);
    // Update tags
    noteList.find(note => note.id === idValue).tags = noteTagsRef.current;
    setNoteList(noteList.filter(note => note !== null));
  }

  function handleClickTag(name) {
    if (noteTags.includes(name)) {
      setNoteTags(noteTags.filter(item => item !== name));
    } else {
      noteTags.push(name);
      setNoteTags(noteTags.filter(item => item !== null));
    }
  }

  return (
      <Dialog open={openNote} onClose={noteCancel} maxWidth='md' fullWidth={true}>
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
            <Chip key={tag.id}
              color='info'
            variant={noteTagsRef.current.includes(tag.name) 
              ? "filled" : "outlined"} 
              onClick={() => {
                handleClickTag(tag.name);
              }}
              label={tag.name}>
            </Chip>
          ))}
        </Stack>
        <DialogActions>
          <Button onClick={noteCancel}>Cancel</Button>
          <Button onClick={handleNoteOkLocal}>Ok</Button>
        </DialogActions>
      </Dialog>
  );
}