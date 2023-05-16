async function CustomFetch(item, collection) {
  var data;
  var error = false;

  console.log(item, ' ', typeof collection === 'undefined');

  if (typeof collection === 'undefined') {
    if (typeof item === 'undefined') {
      error = 'No item or collection was specified';
      return { data, error };
    } else {  
      await fetch(`http://localhost:8000/users/${item}`)
      .then(response => {
        if (!response.ok) {
          throw Error('Could not fetch resource 1');
        }
        return response.json();
      })
      .then(_data => {
        data = _data;
        error = false;
      })
      .catch(err => {
        error = err.message;
      }, 1000);
      return { data, error };
    }
  } else {
    if (typeof item === 'undefined') {
      await fetch(`http://localhost:8000/users/${collection}`)
        .then(response => {
          if (!response.ok) {
            throw Error('Could not fetch resource 2');
          }
          return response.json();
        })
        .then(_data => {
          data = _data;
          error = false;
        })
        .catch(err => {
          error = err.message;
        }, 1000);
      return { data, error };
    } else {
      await fetch(`http://localhost:8000/users/${collection}/${item}`)
        .then(response => {
          if (!response.ok) {
            throw Error('Could not fetch resource 3');
          }
          return response.json();
        })
        .then(_data => {
          data = _data;
          error = false;
        })
        .catch(err => {
          error = err.message;
        }, 1000);
      return { data, error };
    }
  }
}

export default CustomFetch;