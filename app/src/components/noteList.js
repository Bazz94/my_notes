import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { CardActionArea } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { memo, useMemo } from 'react';

export const NoteListComponent = memo(function NoteListComponent({ user_id, noteList, noteListDispatch,
   noteDialogDispatch, setOpenErrorDialog, error, setBackdrop, tagList }) {

  function handleNoteClick(note) {
    const timeFormat = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    };
    const formatModified = new Date(note.modified).toLocaleDateString('en-GB', timeFormat);
    noteDialogDispatch({
      type: 'set',
      open: true
    });
    noteDialogDispatch({
      type: 'set',
      id: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      modified: formatModified,
    });
  }

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
        noteListDispatch({
          type: 'delete',
          _id: id,
        })
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

  const filteredNoteList = useMemo(() => filterNotesList(tagList, noteList), [tagList, noteList]);

  return (
    <Stack spacing={1}>
      {filteredNoteList.map((note) => {
        return (
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
        );
      })}
    </Stack>
  );
});

function filterNotesList(_tagList, _noteList) {
  const selectedTag = _tagList.find(item => item.selected === true);
  let visibleNotes = [];
  if (selectedTag === undefined) {
    visibleNotes = _noteList;
    return visibleNotes;
  }
  _noteList.forEach((note) => {
    if (note.tags.find(item => item._id === selectedTag._id) != null) {
      if (visibleNotes.find(item => item._id === note._id) == null) {
        visibleNotes.push(note);
      }
    }
  });
  return visibleNotes;
}
