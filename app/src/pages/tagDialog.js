import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import { v4 as uuidv4 } from 'uuid';
import { setFetch } from '../requestHandlers.js';

export default function TagDialog(
  { user_id, noteList, noteListRef, setNoteList, tagOpen, setTagOpen, tagList, tagListRef, setTagList, tagName, setTagName,
    setOpenErrorDialog, setError }) {


  function handleClose() {
    const data2 = { "notes": [...noteListRef.current] };
    setFetch(data2, user_id)
      .then((error) => {
        if (error !== false) {
          // Error message
          setError(error);
          setOpenErrorDialog(true);
          // Rollback changes
          return false;
        }
      });

    const data = { "tags": tagListRef.current };
    setFetch(data, user_id)
      .then((error) => {
        if (error !== false) {
          // Error message
          setError(error);
          setOpenErrorDialog(true);
          // Rollback changes
          return false;
        }
      });

    setTagOpen(false);
    setTagName('');
  }

  function handelNewTag() {
    if (tagName.length < 1) {
      return false;
    }
    if (tagList.find(item => item.name === tagName) != null) {
      setError('Tag already exists');
      setOpenErrorDialog(true);
      setTagName('');
      return false;
    }
    tagList.unshift({ id: uuidv4(), name: tagName, editing: false, selected: false})
    setTagList([...tagList]);
  }

  function handleTagEdit(tag) {
    if (tagList.find(item => item.id === tag.id).editing !== true) {
      tagList.forEach((item) => {
        item.editing = false;
      });
      tagList.find(item => item.id === tag.id).editing = true;
      setTagList([...tagList]);
    } else {
      tagList.find(item => item.id === tag.id).editing = false;
      noteList.forEach((note) => {
        if (note.tags.find(item => item.id === tag.id) != null) {
          note.tags.find(item => item.id === tag.id).name = tagList.find(item => item.id === tag.id).name;
        }
      });
      setNoteList([...noteList]);
    }
    setTagList([...tagList]);
  }

  function handleTagDelete(tag) {
    const newList = tagList.filter(item => item.id !== tag.id);
    setTagList(newList);

    noteList.forEach((note) => {
      if (note.tags.find(item => item.id === tag.id) != null) {
        noteList.find(item => item === note).tags = note.tags.filter(item => item.id !== tag.id);
      }
    });
    console.log(noteList);
    setNoteList([...noteList]);

    setTagName('');
  }


  return (
    <div>
      <Dialog open={tagOpen} maxWidth='xs' fullWidth={true}>
        <DialogTitle>Tags</DialogTitle>
        <DialogContent>
          <Stack>
            <Stack direction="row">
              <IconButton aria-label="delete" onClick={(e) => handelNewTag()}>
                <DoneIcon />
              </IconButton>
              <TextField sx={{width: '80%'}}
                autoFocus
                margin="normal"
                id="name"
                type="text"
                fullWidth
                variant="standard"
                size="medium"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
            </Stack>
            {tagList.map((tag) => (
              <Stack direction="row" key={tag.id}>
                <IconButton aria-label="delete" onClick={(e) => handleTagEdit(tag)}>
                  {tag.editing ? <DoneIcon /> : <EditIcon />}
                </IconButton>
                <TextField key={tag.id} 
                  sx={{ width: '80%' }}
                  autoFocus
                  margin="normal"
                  id="name"
                  type="text"
                  fullWidth
                  variant="standard"
                  size="medium"
                  value={tagList.find(item => item.id === tag.id).name}
                  disabled={!(tag.editing)}
                  onChange={(e) => {
                    tagList.find(item => item.id === tag.id).name = e.target.value;
                    setTagList([...tagList]);
                  }}
                />
                {tag.editing ? <IconButton aria-label="delete" onClick={(e) => handleTagDelete(tag)}>
                  <DeleteIcon />
                </IconButton> : null}
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Done</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}