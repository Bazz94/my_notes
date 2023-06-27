/* 
  This component appears on the Home page and shows a list of the users notes. It can be filtered 
  to show only the notes that have a specific tag. Clicking on a note opens it up in the noteDialog
  to be edited. 
*/
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { CardActionArea } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { memo, useMemo } from 'react';

export const NoteListComponent = memo(function NoteListComponent({ user_id, noteList, noteListDispatch,
   noteDialogDispatch, setOpenErrorDialog, errorMessage, setBackdrop, tagList }) {

  function handleNoteClick(note) {
    const timeFormat = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    };
    const formatModified = new Date(note.modified).toLocaleDateString('en-GB', timeFormat);
    // sets the ui of the noteDialog to contain the note that has been clicked on
    // also opens the noteDialog
    noteDialogDispatch({
      type: 'set',
      id: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      modified: formatModified,
      open: true
    });
  }

  async function handleNoteDelete(id) {
    const data = { note_id: id };
    // delete note in db
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
        // Delete note locally
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
        errorMessage.current = err.message;
        setOpenErrorDialog(true);
        return false;
      }
    );
  }

  // a list that is filtered according to the tag that is selected
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
  // find selected tag
  const selectedTag = _tagList.find(item => item.selected === true);
  let visibleNotes = [];
  // check if a tag is selected
  if (selectedTag === undefined) {
    visibleNotes = _noteList;
    return visibleNotes;
  }
  // add notes from noteList that have the selected tag
  _noteList.forEach((note) => {
    if (note.tags.find(item => item._id === selectedTag._id) != null) {
      if (visibleNotes.find(item => item._id === note._id) == null) {
        visibleNotes.push(note);
      }
    }
  });
  return visibleNotes;
}
