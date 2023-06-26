import { useReducer } from "react";

const initObj = {
  open: false,
  name: ''
};
function reducer(state, action) {
  switch (action.type) {
    case 'set': {
      if (action.open === undefined && action.name === undefined) {
        throw Error('Incorrect properties for set on tagDialogControllerReducer');
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

const useNoteListReducer = () => {
  const [list, dispatch] = useReducer(reducer, initObj);
  return [list, dispatch];
};

export default useNoteListReducer;