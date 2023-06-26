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
import { memo, useRef } from 'react';

export const TagDialog = memo(function TagDialog(
  { user_id, noteList, noteListDispatch,  tagList, setTagList,
    setOpenErrorDialog, error, setBackdrop, tagDialogController, tagDialogDispatch}) {

  function handleClose() {
    tagDialogDispatch({
      type: 'clear'
    });
  }

  async function handelNewTag() {
    if (tagDialogController.name.length < 1) {
      return false;
    }
    if (tagList.find(item => item.name === tagDialogController.name) != null) {
      error.current = 'Tag already exists';
      setOpenErrorDialog(true);
      tagDialogDispatch({
        type: 'set',
        name: ''
      });
      return false;
    }

    // create in db
    const data = {
      name: tagDialogController.name,
    }

    setBackdrop(true);
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
        const newTag = { _id: data, name: tagDialogController.name, editing: false, selected: false };
        setTagList([...tagList, newTag]);
        if (process.env.REACT_APP_DEV_MODE === 'true') {
          console.log('Tags updated');
        }
        setBackdrop(false);
      }).catch((err) => {
        setBackdrop(false);
        error.current = err.message;
        setOpenErrorDialog(true);
        return false;
      }
    );
    tagDialogDispatch({
      type: 'set',
      name: ''
    });
  }

  const oldTag = useRef({name: null});

  async function handleTagEdit(tag) {    
    if (tag.editing === false || tag.editing === undefined) {
      const newTagList = tagList.map((item) => {
        if (item !== tag) {
          if (item.editing === true) {
            return { ...item, editing: false, name: oldTag.current.name };
          }
          return item;
        } else {
          return {...item, editing: true};
        }
      });
      setTagList(newTagList);
      oldTag.current = {...tag};
    } else {
      let noteEditLog = [];
      const tempNoteList = noteList;
      const tempTagList = [...tagList];
      const newTagList = tagList.map((item) => {
        if (item !== tag) {
          return item;
        } else {
          return { ...item, editing: false };
        }
      });
      setTagList(newTagList);
      if (oldTag.current.name !== tag.name) {
        const newNoteList = noteList.map((note) => {
          let tagFound = false;
          const newNoteTags = note.tags.map(item => {
            if (item._id === tag._id) {
              tagFound = true;
              return {...item, name: tag.name};
            }
            return item;
          });
          if (tagFound === false) {
            return note;
          }
          return {...note, tags: newNoteTags};
          //
        });
        noteListDispatch({
          type: 'set',
          list: newNoteList
        });
        const data = {
          id: tag._id,
          name: tag.name,
        }
        // set tagList in db
        setBackdrop(true);
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
            if (process.env.REACT_APP_DEV_MODE === 'true') {
              console.log('Tags updated');
            }
            setBackdrop(false);
          }).catch((err) => {
            // revert changes
            setTagList([...tempTagList]);
            noteListDispatch({
              type: 'set',
              list: tempNoteList
            });
            error.current = err.message;
            setBackdrop(false);
            setOpenErrorDialog(true);
            return false;
          }
        );

        // set noteList in db
        fetch(`${process.env.REACT_APP_API_URL}/notes/tags/${user_id}`, {
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
            if (process.env.REACT_APP_DEV_MODE === 'true') {
              if (process.env.REACT_APP_DEV_MODE === 'true') {
                console.log('Notes updated');
              }
            }
          }).catch((err) => {
            // revert changes
            setTagList([...tempTagList]);
            noteListDispatch({
              type: 'set',
              list: tempNoteList
            });
            error.current = err.message;
            setOpenErrorDialog(true);
            return false;
          }
        );
      }
    }
  }

  async function handleTagDelete(tag) {
    const tempTagList = tagList;
    const tempNoteList = noteList;
    let noteDeleteLog = [];

    const newList = tagList.filter(item => item._id !== tag._id);
    
    const newNoteList = noteList.map((note) => {
      if (note.tags.find(item => item._id === tag._id) != null) {
        noteDeleteLog.push({ note_id: note._id, tag_id: tag._id });
        const newNoteTags = note.tags.filter(item => item._id !== tag._id);
        return {...note, newNoteTags};
      }
      return note;
    });

    // set tagList in db
    const data = {
      id: tag._id,
    }
    setBackdrop(true);
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
        setBackdrop(false);
        console.log('Tag deleted');
      }).catch((err) => {
        // revet changes
        setTagList(tempTagList);
        noteListDispatch({
          type: 'set',
          list: tempNoteList
        });
        setBackdrop(false);
        error.current = err.message;
        setOpenErrorDialog(true);
        return false;
      }
    );
    
    // set noteList in db
    fetch(`${process.env.REACT_APP_API_URL}/notes/tags/${user_id}`, {
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
        noteListDispatch({
          type: 'set',
          list: newNoteList
        });
        if (process.env.REACT_APP_DEV_MODE === 'true') {
          console.log('Notes updated');
        }
      }).catch((err) => {
        // revert changes
        setTagList(tempTagList);
        noteListDispatch({
          type: 'set',
          list: tempNoteList
        });
        error.current = err.message;
        setOpenErrorDialog(true);
        return false;
      }
    );

    tagDialogDispatch({
      type: 'set',
      name: ''
    });
  }


  return (
    <div>
      <Dialog open={tagDialogController.open} maxWidth='xs' fullWidth={true}>
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
                value={tagDialogController.name}
                onChange={(e) => tagDialogDispatch({type: 'set',name: e.target.value})}
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
                    const newTagList = tagList.map((item) => {
                      if (item !== tag) {
                        return item;
                      } else {
                        return { ...item, name: e.target.value };
                      }
                    });
                    setTagList(newTagList);
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
});