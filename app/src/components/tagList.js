import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import { Divider } from '@mui/material';

export default function tagList({ 
  tagList, filterNoteListRef, setTagList, noteList, setNoteOpen, setTagOpen,
   filterNoteList, setFilterNoteList}) {

  function handleAddNote() {
    setNoteOpen(true);
  }

  function handleEditTags() {
    setTagOpen(true);
  }

  async function handleTag(tag) {
    // Set tag 
    const tempSelected = tag.selected;
    tagList.find(item => item === tag).selected = !(tempSelected);
    setTagList([...tagList]);
    // Unselect all other tags
    if (tag.selected === true) {
      tagList.forEach((item) => {
        if (item !== tag) {
          item.selected = false;
          setTagList([...tagList]);
        }
      });
    }

    const data = {
      id: tag._id,
      selected: !tempSelected,
    }
    // set tagList in db
    await fetch(`http://localhost:8080/tags`, {
      method: 'PATCH',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (res.ok) {
          console.log('Tag selection updated');
        }
      }
    );

    // Check if tags are selected
    var selected = [];
    tagList.forEach((tag) => {
      if (tag.selected) {
        selected.push(tag);
      }
    });
    if (selected.length === 0) {
      setFilterNoteList(noteList);
      return false;
    }
    setFilterNoteList([]);
    selected.forEach((tag) => {
      noteList.forEach((note) => {
        if (note.tags.find(item => item._id === tag._id) != null) {
          if (filterNoteListRef.current.find(item => item === note) == null) {
            filterNoteListRef.current.push(note);
            setFilterNoteList([...filterNoteListRef.current]);
          }
        }
      });
    });
  }

  return (
    <Card sx={{ padding: '0.4rem', height: 'calc(100% - 0.8rem)'}}>
      <Paper elevation={1} />
      <Stack spacing={0.5}>
        <ButtonGroup orientation="vertical"
          aria-label="vertical contained button group">
        <Button variant="contained"
          onClick={handleAddNote}>
          New Note
        </Button>
        <Button variant="contained"
          color='secondary'
          onClick={handleEditTags}>
          Edit Tags
        </Button>
        <Divider/>
        </ButtonGroup>
        {tagList.map((tag) => (
          <Chip key={tag._id}
            color='info'
            variant={tag.selected
              ? "filled" : "outlined"} 
            onClick={() => {
              handleTag(tag);
            }}
            label={tag.name}>
          </Chip>
        ))}
      </Stack>
    </Card>
  );
}

