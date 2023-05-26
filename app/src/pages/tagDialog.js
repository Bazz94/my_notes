import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';


var oldTag;

export default function TagDialog(
  { user_id, noteList, noteListRef, setNoteList, tagOpen, setTagOpen, tagList, tagListRef, setTagList, tagName, setTagName,
    setOpenErrorDialog, setError }) {



  function handleClose() {
    setTagOpen(false);
    setTagName('');
  }

  async function handelNewTag() {
    if (tagName.length < 1) {
      return false;
    }
    if (tagList.find(item => item.name === tagName) != null) {
      setError('Tag already exists');
      setOpenErrorDialog(true);
      setTagName('');
      return false;
    }

    // create in db
    const data = {
      name: tagName,
    }

    await fetch(`${process.env.REACT_APP_API_URL}/tags/${user_id}`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (!res.ok) {
          throw Error(res.message);
        }
        return res.json();
      }).then((data) => {
        tagList.unshift({ _id: data, name: tagName, editing: false, selected: false })
        setTagList([...tagList]);
        console.log('Tags updated');
      }).catch((err) => {
        setError(err.message);
        setOpenErrorDialog(true);
        return false;
      }
    );
    setTagName('');
  }

  
  async function handleTagEdit(tag) {
    if (tag.editing !== true) {
      tagList.forEach((item) => {
        if (item.editing === true) {
          item.name = oldTag.name;
        }
        item.editing = false;
      });
      oldTag = {...tag};
      tag.editing = true;
      setTagList([...tagList]);
    } else {
      let noteEditLog = [];
      const tempNoteList = noteList;
      tag.editing = false;
      if  (oldTag.name !== tag.name) {
        noteList.forEach((note) => {
          const noteTag = note.tags.find(item => item._id === tag._id); 
          if (noteTag != null) {
            noteEditLog.push({ note_id: note._id, tag_id: tag._id, name: tag.name });
            noteTag.name = tag.name;
          }
        });
        const data = {
          id: tag._id,
          name: tag.name,
        }
        // set tagList in db
        await fetch(`${process.env.REACT_APP_API_URL}/tags/${user_id}`, {
          method: 'PATCH',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(data)
        })
          .then((res) => {
            if (!res.ok) {
              throw Error(res.message);
            }
            setTagList([...tagList]);
            console.log('Tags updated');
          }).catch((err) => {
            // revert changes
            tag.name = oldTag.name;
            setTagList([...tagList]);
            setNoteList([...tempNoteList]);
            setError(err.message);
            setOpenErrorDialog(true);
            return false;
          }
        );

        // set noteList in db
        await fetch(`${process.env.REACT_APP_API_URL}/notes/tags/${user_id}`, {
          method: 'PATCH',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(noteEditLog)
        })
          .then((res) => {
            if (!res.ok) {
              throw Error(res.message);
            }
            setNoteList([...noteList]);
            console.log('Notes updated');
          }).catch((err) => {
            // revert changes
            tag.name = oldTag.name;
            setTagList([...tagList]);
            setNoteList([...tempNoteList]);
            setError(err.message);
            setOpenErrorDialog(true);
            return false;
          }
        );
      }
      tag.editing = false;
      setTagList([...tagList]);
    }
  }

  async function handleTagDelete(tag) {
    const tempTagList = tagList;
    const tempNoteList = noteList;
    let noteDeleteLog = [];

    const newList = tagList.filter(item => item._id !== tag._id);
    
    noteList.forEach((note) => {
      if (note.tags.find(item => item._id === tag._id) != null) {
        noteDeleteLog.push({ note_id: note._id, tag_id: tag._id });
        note.tags = note.tags.filter(item => item._id !== tag._id);
      }
    });
    
    // set tagList in db
    const data = {
      id: tag._id,
    }
    await fetch(`${process.env.REACT_APP_API_URL}/tags/${user_id}`, {
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
        setTagList(newList);
        console.log('Tag deleted');
      }).catch((err) => {
        // revet changes
        setTagList(tempTagList);
        setNoteList(tempNoteList);
        setError(err.message);
        setOpenErrorDialog(true);
        return false;
      }
    );
    
    // set noteList in db
    await fetch(`${process.env.REACT_APP_API_URL}/notes/tags/${user_id}`, {
      method: 'DELETE',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(noteDeleteLog)
    })
      .then((res) => {
        if (!res.ok) {
          throw Error(res.message);
        }
        setNoteList([...noteList]);
        console.log('Notes updated');
      }).catch((err) => {
        // revert changes
        setTagList(tempTagList);
        setNoteList(tempNoteList);
        setError(err.message);
        setOpenErrorDialog(true);
        return false;
      }
    );

    setTagName('');
  }


  return (
    <div>
      <Dialog open={tagOpen} maxWidth='xs' fullWidth={true}>
        <DialogTitle>Tags</DialogTitle>
        <DialogContent>
          <Stack>
            <Stack direction="row">
              <IconButton aria-label="delete" onClick={(e) => handelNewTag()}>
                <DoneIcon />
              </IconButton>
              <TextField sx={{width: '80%'}}
                autoFocus
                margin="normal"
                id="name"
                type="text"
                fullWidth
                variant="standard"
                size="medium"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
            </Stack>
            {tagList.map((tag) => (
              <Stack direction="row" key={tag._id}>
                <IconButton aria-label="delete" onClick={(e) => handleTagEdit(tag)}>
                  {tag.editing ? <DoneIcon /> : <EditIcon />}
                </IconButton>
                <TextField key={tag._id} 
                  sx={{ width: '80%' }}
                  autoFocus
                  margin="normal"
                  id="name"
                  type="text"
                  fullWidth
                  variant="standard"
                  size="medium"
                  value={tag.name}
                  disabled={!(tag.editing)}
                  onChange={(e) => {
                    tag.name = e.target.value;
                    setTagList([...tagList]);
                  }}
                />
                {tag.editing ? <IconButton aria-label="delete" onClick={(e) => handleTagDelete(tag)}>
                  <DeleteIcon />
                </IconButton> : null}
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Done</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}