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
    // Set tag 
    tagList.find(item => item === tag).selected = !(tag.selected);
    setTagList(tagList.filter(item => item !== null));
    // Check if tags are selected
    var selected = [];
    
    for (const tag in tagList) {
      if (tag.selected) {
        selected.push(tag);
      }
    }
    if (selected.length === 0) {
      setFilterNoteList(tagList);
      return false;
    }
    console.log('flag1');
    for (const tag in selected) {
      console.log('flag2');
      for (const note in noteList) {
        console.log('flag3');
        if (note.tags.find(item => item === tag.name)) {
          console.log('flag4');
          if (!(filterNoteList.find(item => item === note))) {
            filterNoteList.push(note);
            console.log(note.name);
          }
        }
      }
    }
    setTagList(tagList.filter(item => item !== null));

    // if (tag.selected) {
    //   const filteredList = filterNoteList.filter(note => note.tags.find(item => item === tag.name));
    //   console.log('Final List: ', filteredList);
    //   setFilterNoteList(filteredList);
    // } else {
    //   const excludedList = noteList.filter(note => !(note.tags.find(item => item === tag.name)));
    //   console.log('excluded: ', excludedList);
    //   const newList = filterNoteList.concat(excludedList);
    //   console.log('Final List (unselect): ',newList);
    //   setFilterNoteList(newList);
    // }
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

