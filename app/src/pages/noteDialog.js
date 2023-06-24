import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useState, memo } from 'react';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material';



export const NoteDialog = memo(function NoteDialog({ 
  user_id, tagList, noteList, setNoteList, filterNoteList, 
  setFilterNoteList, noteDialogController, noteDialogDispatch, setOpenErrorDialog, 
  error, setBackdrop, isDesktopView }) {

  const [inputError, setInputError] = useState(false);

  function noteCancel() {
    noteDialogDispatch({
      type: 'clear',
    });
  }; 

  async function handleNoteOk() {

    if (noteDialogController.title === '') {
      setInputError(true);
      return false;
    }
    if (noteDialogController.id !== null) {
      // Update note
      const note = noteList.find(note => note._id === noteDialogController.id);
      if (note.title !== noteDialogController.title
        || note.content !== noteDialogController.content
        || note.tags !== noteDialogController.tags
      ) {
        const data = {
          note_id: noteDialogController.id,
          title: noteDialogController.title,
          content: noteDialogController.content,
          tags: noteDialogController.tags
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
            }).then((modifiedDate) => {
              const editedNote = {
                _id: noteDialogController.id,
                title: noteDialogController.title,
                content: noteDialogController.content,
                tags: noteDialogController.tags,
                modified: modifiedDate,
                created: note.created
              };
              const editedNoteList = noteList.map(item => {
                if (item._id === editedNote._id) {
                  return editedNote;
                } else {
                  return item;
                }
              });
              setNoteList([...editedNoteList]);

              const editedFilterNoteList = filterNoteList.map(item => {
                if (item._id === editedNote._id) {
                  return editedNote;
                } else {
                  return item;
                }
              });
              setFilterNoteList([...editedFilterNoteList]);
              setBackdrop(false);
              if (process.env.REACT_APP_DEV_MODE === 'true') {
                console.log('Notes updated');
              }
            }).catch((err) => {
              setBackdrop(false);
              error.current = err.message;
              setOpenErrorDialog(true);
              return false;
            }
          );
      }
    } else {
      // Create note
      
      let data = {
        title: noteDialogController.title,
        content: noteDialogController.content,
        tags: noteDialogController.tags
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
            title: noteDialogController.title, 
            content: noteDialogController.content, 
            tags: noteDialogController.tags, 
            modified: data.modified
          };
          noteDialogDispatch({
            type: 'set',
            id: data._id,
          });
          const newNoteList = [newNote, ...noteList]
          // Check to see if note can be displayed on filterNoteList
          const selectedTag = tagList.find((item) => item.selected === true);
          let newFilterNote = [];
          if (selectedTag == null) {
            newFilterNote = [newNote, ...filterNoteList];
          } 
          if (noteDialogController.tags.includes(selectedTag)){
            newFilterNote = [newNote, ...filterNoteList];
          }
          setNoteList(newNoteList);
          setFilterNoteList(newFilterNote);
          setBackdrop(false);
          if (process.env.REACT_APP_DEV_MODE === 'true') {
            console.log('Notes created');
          }
        }).catch((err) => {
          setBackdrop(false);
          error.current = err.message;
          setOpenErrorDialog(true);
          return false;
        }
      );
    }

    // Clean up 
    noteDialogDispatch({
      type: 'clear'
    });
    setInputError(false);
  }

  function handleClickTag(tag) {
    if (noteDialogController.tags.find(item => item._id === tag._id) != null) {
      noteDialogDispatch({
        type: 'set',
        tags: noteDialogController.tags.filter(item => item._id !== tag._id)
      });
    } else {
      const newNoteTags = [...noteDialogController.tags, tag]; 
      noteDialogDispatch({
        type: 'set',
        tags: newNoteTags
      });
    }
  }

  return (
    <Dialog open={noteDialogController.open} maxWidth='md' fullWidth={true}>
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
          value={noteDialogController.title}
          onChange={(e) => noteDialogDispatch({ type: 'set', title: e.target.value })}
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
          value={noteDialogController.content}
          onChange={(e) => noteDialogDispatch({ type: 'set', content: e.target.value })}
        />
      </DialogContent>
      <Stack direction='row' sx={{ padding: isDesktopView ? '0px 1.5rem' : '0px 0.6rem'}}>
          {tagList.map((tag) => (
            <Chip key={tag._id}
              color='info'
              variant={noteDialogController.tags.find(item => item._id === tag._id) != null 
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
          { noteDialogController.modified && (
          <Typography sx={{ marginRight: '1rem' }}
              variant="caption" color="common"> Modified {noteDialogController.modified}
          </Typography>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
});