import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { CardActionArea } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { setFetch } from '../requestHandlers.js';

export default function NoteList({ user_id, noteList, setNoteList, filterNoteList, setFilterNoteList,
   handleNoteClick, setOpenErrorDialog, setError }) {

  function handleNoteDelete(id) {
    const tempNoteList = noteList;
    const tempFilterNoteList = filterNoteList;
    const newList = noteList.filter(note => note.id !== id);
    const newFilterList = filterNoteList.filter(note => note.id !== id);
    setNoteList(newList);
    setFilterNoteList(newFilterList);
    // TODO: sends all notes to db rather than deleting a single item
    const data = { "notes": newList };
    setFetch(data, user_id)
      .then((error) => {
        if (error !== false) {
          // Error message
          setError(error);
          setOpenErrorDialog(true);
          // Rollback changes
          setNoteList([...tempNoteList]);
          setFilterNoteList([...tempFilterNoteList]);
          return false;
        }
        console.log('Update db after delete');
      });
  }

  return (
    <Stack spacing={1}>
      {filterNoteList.map((note) => (
        <Card sx={{ minWidth: 200 }} key={note.id}>
          <Stack direction="row">
            <CardActionArea onClick={(e) => handleNoteClick(note.id)}> 
              <ListItem>
                <ListItemText
                  primary={note.title}
                  secondary={note.content && note.content.substring(0, 80)}
                />
              </ListItem>
            </CardActionArea>
            <IconButton aria-label="delete" onClick={(e) => handleNoteDelete(note.id)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Card>
      ))}
    </Stack>
);}