import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function tagList({ 
  tagList, filterNoteListRef, setTagList, noteList, setNoteList, setNoteOpen, setTagOpen,
   filterNoteList, setFilterNoteList}) {

  function handleAddNote() {
    setNoteOpen(true);
  }

  function handleEditTags() {
    setTagOpen(true);
  }

  function handleTag(tag) {
    // Set tag 
    tagList.find(item => item === tag).selected = !(tag.selected);
    setTagList(tagList.filter(item => item !== null));
    // Unselect all other tags
    tagList.forEach((item) => {
      if (item !== tag) {
        item.selected = false;
        setTagList(tagList.filter(item => item !== null));
      }
    })
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
    console.log('flag1 ', filterNoteListRef.current);
    selected.forEach((tag) => {
      noteList.forEach((note) => {
        console.log('note has tag ', tag.name, ' ', note.tags.find(item => item === tag.name) != null);
        if (note.tags.find(item => item === tag.name) != null) {
          console.log('not already added ', filterNoteListRef.current.find(item => item === note) != null);
          if (filterNoteListRef.current.find(item => item === note) == null) {
            console.log('flag2 ', filterNoteListRef.current);
            console.log('flag2.1', filterNoteList);
            filterNoteListRef.current.push(note);
            setFilterNoteList(filterNoteListRef.current.filter(item => item !== null));
            console.log('flag3 ', filterNoteListRef.current);
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
        </ButtonGroup>
        {tagList.map((tag) => (
          <Button key={tag.id}
            color='info'
            variant={tag.selected
              ? "contained" : "outlined"} 
            onClick={() => {
              handleTag(tag);
            }}>
            {tag.name}
          </Button>
        ))}
      </Stack>
    </Card>
  );
}

