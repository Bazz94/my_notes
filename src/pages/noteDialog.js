import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { v4 as uuidv4 } from 'uuid';

export default function NoteDialog({ 
  openNote, setNoteOpen, titleValue, setTitle, contentValue, setContent, idValue, setId,
  noteTags, setNoteTags, tagList, noteList, setNoteList}) {

  const [inputError, setInputError] = useState(false);

  function noteCancel() {
    setNoteOpen(false);
    setTitle('');
    setContent('');
    setNoteTags([]);
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
    setNoteOpen(false);
    setTitle('');
    setContent('');
    setId(null);
    setInputError(false);
  }

  function handleClickTag(name) {
    console.log('handleClickTag', ' ', noteTags);
    if (noteTags.includes(name)) {
      var newList = noteTags.filter(item => item !== name);
      setNoteTags(newList);
      console.log('true');
    } else {
      noteTags.push(name);
      setNoteTags(noteTags.filter(item => item !== null));
      console.log('false');
    }
    console.log('noteTags', ' ', noteTags);
    noteList.find(note => note.id === idValue).tags = noteTags;
    setNoteList(noteList.filter(note => note !== null));
  }

  return (
    <div>
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
            <Button key={tag.id}
            variant={noteTags.includes(tag.name) 
              ? "contained" : "outlined"} 
              onClick={() => {
                handleClickTag(tag.name);
              }}>
              {tag.name}
            </Button>
          ))}
        </Stack>
        <DialogActions>
          <Button onClick={noteCancel}>Cancel</Button>
          <Button onClick={handleNoteOkLocal}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}