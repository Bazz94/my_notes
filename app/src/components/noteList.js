import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { CardActionArea } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { memo } from 'react';

export const NoteListComponent = memo(function NoteListComponent({ user_id, noteList, setNoteList, filterNoteList, setFilterNoteList,
  handleNoteClick, setOpenErrorDialog, error, setBackdrop }) {

  async function handleNoteDelete(id) {
    const data = { note_id: id };

    setBackdrop(true);
    await fetch(`${process.env.REACT_APP_API_URL}/notes/${user_id}`, {
      method: 'DELETE',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (!res.ok) {
          throw Error(res.message);
        }
        const newList = noteList.filter(note => note._id !== id);
        const newFilterList = filterNoteList.filter(note => note._id !== id);
        setNoteList(newList);
        setFilterNoteList(newFilterList);
        if(process.env.REACT_APP_DEV_MODE){
          console.log('Note deleted');
        }
        setBackdrop(false);
      }).catch((err) => {
        setBackdrop(false);
        error.current = err.message;
        setOpenErrorDialog(true);
        return false;
      }
    );
  }

  return (
    <Stack spacing={1}>
      {filterNoteList.map((note) => (
        <Card sx={{ minWidth: 200 }} key={note._id}>
          <Stack direction="row">
            <CardActionArea onClick={(e) => handleNoteClick(note)}> 
              <ListItem>
                <ListItemText
                  primary={note.title}
                  secondary={note.content && note.content.substring(0, 80)}
                />
              </ListItem>
            </CardActionArea>
            <IconButton aria-label="delete" onClick={(e) => handleNoteDelete(note._id)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
});