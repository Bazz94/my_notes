/* 
  A custom useReducer that contains and handles data displayed on the tagDialog. 
  The open property, opens and closes the noteDialog.
*/
import { useReducer } from "react";

// Initial values for the reducer object
const initObj = {
  open: false,
  name: ''
};

// Handles changes made to properties
function reducer(state, action) {
  switch (action.type) {
    // set
    case 'set': {
      // Check that the required vars are set from action param
      if (action.open === undefined && action.name === undefined) {
        throw Error('Incorrect properties for set on tagDialogControllerReducer');
      }
      // If a property is set in the action param then it gets set in the reducers state
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
    // clear
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