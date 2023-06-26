import { useReducer } from "react";

// action._id
// action.title
// action.content
// action.tags
// action.modified

function reducer(list, action) {

  switch (action.type) {
    case 'set': {
      if (action.list === undefined) {
        throw Error('Incorrect properties for set on noteLustReducer');
      }
      return [...action.list];
    }
    case 'add': {
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
    case 'edit': {
      if (action._id === undefined && action.title === undefined && action.content === undefined
        && action.tags === undefined && action.modified === undefined && action.created === undefined
      ) {
        throw Error('Incorrect properties for edit on noteLustReducer');
      }
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
    case 'delete': {
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