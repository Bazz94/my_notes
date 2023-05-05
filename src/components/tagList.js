import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';

export default function tagList({ 
  tagList, setTagList, noteList, setNoteList, setNoteOpen, setTagOpen,
   filterNoteList, setFilterNoteList}) {

  function handleAddNote() {
    setNoteOpen(true);
  }

  function handleEditTags() {
    setTagOpen(true);
  }

  function handleTag(tag) {
    tagList.find(item => item === tag).selected = !(tag.selected);
    setTagList(tagList.filter(item => item !== null));
    if (tag.selected) {
      setFilterNoteList(filterNoteList.filter(note => note.tags.find(item => item === tag.name)));
    } else {
      const excludedList = noteList.filter(note => !(note.tags.find(item => item === tag.name)));
      const newList = filterNoteList.concat(excludedList);
      setFilterNoteList(newList);
    }
  }

  return (
    <Card sx={{ padding: '0.4rem', height: 'calc(100% - 0.8rem)'}}>
      <Paper elevation={1} />
      <Stack spacing={0.5}>
        <Button variant="contained"
          onClick={handleAddNote}>
          New Note
        </Button>
        <Button variant="contained"
          onClick={handleEditTags}>
          Edit Tags
        </Button>
        {tagList.map((tag) => (
          <Button key={tag.id}
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

