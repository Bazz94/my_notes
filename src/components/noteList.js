import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { CardActionArea } from "@mui/material";

export default function noteList({ notes }) {
  return (
    <Stack spacing={1}>
      {notes.map((note) => (
        <Card sx={{ minWidth: 200 }} key={note.id}>
          <CardActionArea>
            <ListItem>
              <ListItemText
                primary={note.title}
                secondary={note.subtext}
              />
            </ListItem>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
);}