import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/home.js';
import Login from './pages/login.js';
import SignUp from './pages/signup.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { cyan, yellow } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { MyUserIDProvider } from './components/provider.js';


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: yellow,
    secondary: cyan,
    info: cyan  
  }
});


function App() {
  return (
    <MyUserIDProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/signup" element={<SignUp/>}></Route>
            <Route path="/*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </MyUserIDProvider>
  );
}

export default App;

