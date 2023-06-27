/*
  A custom useReducer that contains the users notes and handles interactions with them.
*/
import { useReducer } from "react";

// Handles changes made to properties
function reducer(list, action) {
  switch (action.type) {
    // set 
    case 'set': {
      if (action.list === undefined) {
        throw Error('Incorrect properties for set on noteLustReducer');
      }
      return [...action.list];
    }
    // add
    case 'add': {
      // Check that the required vars are set from action param
      if (action._id === undefined || action.title === undefined || action.content === undefined
        || action.tags === undefined || action.modified === undefined || action.created === undefined
      ) {
        throw Error('Incorrect properties for add on noteLustReducer');
      }
      const newNote = { 
        _id: action._id,
        title: action.title,
        content: action.content,
        tags: action.tags,
        modified: action.modified,
        created: action.created
      }
      return [newNote, ...list];
    }
    // edit
    case 'edit': {
      // Check that the required vars are set from action param
      if (action._id === undefined && action.title === undefined && action.content === undefined
        && action.tags === undefined && action.modified === undefined && action.created === undefined
      ) {
        throw Error('Incorrect properties for edit on noteLustReducer');
      }
      // If a property is set in the action param then it gets set in the reducers state
      return list.map(note => {
        if (note._id === action._id) {
          return Object.fromEntries(
            Object.entries(note).map(([key, value]) => {
              if (action.hasOwnProperty(key)) {
                return [key, action[key]];
              } else {
                return [key, value];
              }
            })
          );
        } else {
          return note;
        }
      });
    }
    // delete
    case 'delete': {
      // Check that the required vars are set from action param
      if (action._id === undefined) {
        throw Error('Incorrect properties for delete on noteLustReducer');
      }
      return list.filter(item => item._id !== action._id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const useNoteListReducer = () => {
  const [list, dispatch] = useReducer(reducer, []);
  return [list, dispatch];
};

export default useNoteListReducer;