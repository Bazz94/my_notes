import { useReducer } from "react";

// action.id
// action.title
// action.content
// action.tags
// action.modified

function reducer(list, action) {
  switch (action.type) {
    case 'add': {
      return [...list, {
        _id: action.id,
        title: action.title,
        content: action.content,
        tags: action.tags,
        modified: action.modified,
      }];
    }
    case 'edit': {
      return list.map(item => {
        if (item._id === action.task.id) {
          return action.task;
        } else {
          return item;
        }
      });
    }
    case 'delete': {
      return list.filter(item => item._id !== action.id);
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