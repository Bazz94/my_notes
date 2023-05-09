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

export default function TagDialog(
  { tagOpen, setTagOpen, tagList, setTagList, tagName, setTagName }) {

  function handleClose() {
    setTagOpen(false);
  }

  function handelNewTag() {
    // Check to make sure it is
    tagList.unshift({name: tagName, id: uuidv4()})
    setTagList(tagList.filter(tag => tag !== null));
    setTagName('');
  }

  function handleTagEdit(id) {
    if (tagList.find(tag => tag.id === id).editing !== true) {
      tagList.forEach((tag) => {
        tag.editing = false;
      });
      tagList.find(tag => tag.id === id).editing = true;
    } else {
      tagList.find(tag => tag.id === id).editing = false;
    }
    setTagList(tagList.filter(tag => tag !== null));
  }

  function handleTagDelete(id) {
    setTagList(tagList.filter(tag => tag.id !== id));
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
                <IconButton aria-label="delete" onClick={(e) => handleTagEdit(tag.id)}>
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
                    setTagList(tagList.filter(tag => tag !== null));
                  }}
                />
                {tag.editing ? <IconButton aria-label="delete" onClick={(e) => handleTagDelete(tag.id)}>
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