import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Create from './pages/create.js';
import Notes from './pages/notes.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/">
          <Notes />
        </Route>
        <Route exact path="/create">
          <Create />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

