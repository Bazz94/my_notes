import { useReducer } from "react";

const initObj = {
  id: null,
  title: '',
  content: '',
  tags: [],
  modified: null,
  open: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'set': {
      if (action.id === undefined && action.title === undefined && action.content === undefined 
        && action.tags === undefined && action.modified === undefined && action.open === undefined
      ) {
        throw Error('Incorrect properties for set on noteDialogControllerReducer');
      }
        return Object.fromEntries(
          Object.entries(state).map(([key, value]) => {
            if (action.hasOwnProperty(key)) {
              return [key, action[key]];
            } else {
              return [key, value];
            }
          })
        );
      }
    case 'clear': {
      return initObj;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const useNoteDialogControllerReducer = () => {
  const [state, dispatch] = useReducer(reducer, initObj);
  return [state, dispatch];
};

export default useNoteDialogControllerReducer;

