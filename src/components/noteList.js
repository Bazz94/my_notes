import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { CardActionArea } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function noteList({ notes, handleNoteClick, handleNoteDelete }) {
  return (
    <Stack spacing={1}>
      {notes.map((note) => (
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