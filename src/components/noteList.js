import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { CardActionArea } from "@mui/material";

export default function noteList({ notes, handleNoteClick }) {
  return (
    <Stack spacing={1}>
      {notes.map((note) => (
        <Card sx={{ minWidth: 200 }} key={note.id}>
          <CardActionArea onClick={(e) => handleNoteClick(note.id)}> 
            <ListItem>
              <ListItemText
                primary={note.title}
                secondary={note.content.substring(0, 10)}
              />
            </ListItem>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
);}