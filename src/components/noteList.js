import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { CardActionArea } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function noteList({ noteList, setNoteList, setNoteOpen, setTitle, setContent,
  setId, setNoteTags }) {

  function handleNoteClick(id) {
    setNoteOpen(true);
    const note = noteList.find(note => note.id === id);
    setTitle(note.title);
    setContent(note.content);
    setId(id);
    setNoteTags(note.tags)
  }

  function handleNoteDelete(id) {
    const newList = noteList.filter(note => note.id !== id);
    setNoteList(newList);
  }

  return (
    <Stack spacing={1}>
      {noteList.map((note) => (
        <Card sx={{ minWidth: 200 }} key={note.id}>
          <Stack direction="row">
            <CardActionArea onClick={(e) => handleNoteClick(note.id)}> 
              <ListItem>
                <ListItemText
                  primary={note.title}
                  secondary={note.content.substring(0, 80)}
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