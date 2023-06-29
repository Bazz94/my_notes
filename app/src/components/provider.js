import React, { createContext, useRef, useState } from 'react';
import Cookies from 'js-cookie';

// Create a context
const MyContext = createContext(null);
const cookieOptions = { expires: 7, domain: process.env.REACT_APP_DOMAIN, secure: true };

// Create a provider component
function MyUserIDProvider({ children }) {
  const isLocalStorageAvailable = useRef(checkLocalStorageAvailability());
  const [user_id, setUser_id] = useState(isLocalStorageAvailable.current ? Cookies.get('user-id') : null);

  const updateUser_id = (newValue) => {
    setUser_id(newValue);
    if (isLocalStorageAvailable) {
      if (newValue == null) {
        Cookies.remove('user-id', cookieOptions);
        return false;
      }
      Cookies.set('user-id', newValue, cookieOptions);
    }
  }

  return (
    <MyContext.Provider value={{ user_id, updateUser_id }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyUserIDProvider };


function checkLocalStorageAvailability() {
  try {
    var testKey = 'test';
    Cookies.set(testKey, testKey, cookieOptions);
    Cookies.remove(testKey, cookieOptions);
    return true;
  } catch (e) {
    return false;
  }
}