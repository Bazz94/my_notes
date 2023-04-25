import * as React from 'react';
import { Typography, Container, CardActionArea} from "@mui/material";
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import {useState } from 'react';


export default function Notes() {
  var [noteList, setNoteList] = useState([]);

  function addNote() {
    noteList.push({title: 'The Title', subtext: 'The subtext'});
    console.log(noteList);
    setNoteList(remakeArray(noteList));
  }

  function addTag() {

  }

  return (
    <div>
      <Container maxWidth="sm">
        <Typography variant="h1">
          My Notes
        </Typography>
        <Container maxWidth="sm">
          <Button variant="contained"
            onClick={addNote}>
            New Note
          </Button>
          <Button variant="outlined"
            onClick={addTag}>
            New Tag
            </Button>
        </Container>
        <Container maxWidth="sm">
          <List dense={true}> 
            {noteList.map((item) => (
              <Card sx={{ minWidth: 200 }}>
                <CardActionArea>
                  <ListItem>
                    <ListItemText
                      primary={item.title}
                      secondary={item.subtext}
                    />
                  </ListItem>
                </CardActionArea>
              </Card>
            ))}
          </List>
        </Container>
      </Container>
    </div>
  )
}

function remakeArray(array, from, to) {
  const arr = [...array];
  [arr[from], arr[to]] = [arr[to], arr[from]];
  return arr;
}