import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';

export default function tagList({ addNote, editTags, tags, handleTag }) {
  return (
    <Card sx={{ padding: '0.4rem', height: 'calc(100% - 0.8rem)'}}>
      <Paper elevation={1} />
      <Stack spacing={0.5}>
        <Button variant="contained"
          onClick={addNote}>
          New Note
        </Button>
        <Button variant="contained"
          onClick={editTags}>
          Edit Tags
        </Button>
        {tags.map((tag) => (
          <Button variant="outlined"
            onClick={() => {
              handleTag(tag.name);
            }}>
            {tag.name}
          </Button>
        ))}
      </Stack>
    </Card>
  );
}

