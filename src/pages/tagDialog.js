import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export default function TagDialog(
  { tagOpen, setTagOpen, tagList,  tagName, setTagName }) {

  function handleClose() {
    setTagOpen(false);
  }

  return (
    <div>
      <Dialog open={tagOpen} maxWidth='sm' fullWidth={true}>
        <DialogTitle>Tags</DialogTitle>
        <DialogContent>
          <Stack>
            {tagList.map((tag) => (
              <TextField key={tag.id}
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
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}