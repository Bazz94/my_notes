import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';

export default function NoteDialog({ 
  openNote, handleNoteCancel, handleNoteOk, titleValue, setTitle, contentValue, setContent}) {
  const [inputError, setInputError] = useState(false);

  function handleNoteOkLocal() {
    if (titleValue === '') {
      setInputError(true);
      return false;
    }
    handleNoteOk();
    setInputError(false);
  }

  return (
    <div>
      <Dialog open={openNote} onClose={handleNoteCancel} maxWidth='md' fullWidth={true}>
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
        <DialogActions>
          <Button onClick={handleNoteCancel}>Cancel</Button>
          <Button onClick={handleNoteOkLocal}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}