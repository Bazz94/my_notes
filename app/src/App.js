import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { cyan, yellow, green } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: yellow,
    secondary: cyan,
    info: cyan  
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

