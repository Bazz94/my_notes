import * as React from 'react';
import { Typography, Container } from "@mui/material";
import { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { v4 as uuidv4 } from 'uuid';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/users/1')
      .then(response => {
        return response.json();
      })
      .then(data => {
        
      });
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState(null);

  function handleSignUp() {
    // Check that password match
    if (password !== passwordCheck) {
      setError('Passwords do not match');
      setOpenErrorDialog(true);
      return false;
    } 
    if (email === '' ) {
      setError('Please enter an email address');
      return false;
    }
    if (password === '') {
      setError('Please enter a password');
      return false;
    }
    if (password.length < 7) {
      setError('Passwords should be at least 8 characters');
      return false;
    }
    // Create user
    //TODO: 

    // Login
    localStorage.setItem("user-id", 'u' + uuidv4());
    localStorage.setItem("authenticated", true);
    navigate("/home");
  }

  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  function handleErrorDialogOk() {
    setOpenErrorDialog(false);
  }

  return (
    <Container maxWidth="false"
      sx={{
        width: 'clamp(350px,60%,40rem)',
        minHeight: '100vh', // weird
        padding: '1rem',
        paddingTop: '10%'
      }}>
      <Typography
        variant="h1"
        sx={{ margin: '4rem', textAlign: 'center' }} >
        My Notes
      </Typography>
      <Stack
        sx={{}}
      >
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ margin: '0.5rem' }}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ margin: '0.5rem' }}
        />
        <TextField
          id="passwordCheck"
          label="Password"
          variant="outlined"
          type="password"
          required
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
          sx={{ margin: '0.5rem' }}
        />
        <Button
          variant="contained"
          onClick={handleSignUp}
          type='button'
          sx={{ margin: '0.5rem' }}
        >Submit
        </Button>
        <Button
          variant="outlined"
          href="/login"
          type='button'
          sx={{ margin: '0.5rem' }}
        >Login
        </Button>
      </Stack>
      <Dialog open={openErrorDialog} maxWidth='sm' fullWidth={true}>
        <DialogContent>
          <Typography>
            {error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogOk}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}