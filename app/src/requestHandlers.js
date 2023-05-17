

export default async function getFetch(item, collection) {
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


export async function setFetch(data, user, collection) {
  var error = false;

  if (typeof user === 'undefined') {
    await fetch(`http://localhost:8000/users/`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
          throw Error('Could not set resource');
        }
      })
      .catch(err => {
        error = err.message;
      }, 1000);
    return error;
  } else {
    await fetch(`http://localhost:8000/users/${user}/${collection}`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(response => {
      if (!response.ok) {
        throw Error('Could not set resource');
      }
    })
      .catch(err => {
        error = err.message;
      }, 1000);
    return error;
  }
}