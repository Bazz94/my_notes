import * as React from 'react';
import { Typography, Container } from "@mui/material";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingComponent from '../components/loading.js';
import Cookies from 'js-cookie';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Login() {
  const navigate = useNavigate();
  const isDesktopView = useMediaQuery('(min-width:600px)');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  async function handleSignUp() {
    // Check that password match
    if (password !== passwordCheck) {
      setError('Passwords do not match');
      setOpenErrorDialog(true);
      return false;
    } 
    if (email === '' ) {
      setError('Please enter an email address');
      setOpenErrorDialog(true);
      return false;
    }
    if (password === '') {
      setError('Please enter a password');
      setOpenErrorDialog(true);
      return false;
    }
    if (password.length < 7) {
      setError('Passwords should be at least 8 characters');
      setOpenErrorDialog(true);
      return false;
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
        'Authorization': JSON.stringify({ email: email, password: password })
      }
    };
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/auth`, requestOptions)
    .then((res) => {
      if (res.status === 500) {
        throw Error("Server error");
      } 
      if (res.status === 400) {
        setOpenErrorDialog(true);
        throw Error("This email already exists");
      }
      if (res.ok) {
        return res.json();
      }
    }).then((data) => {
      // Login
      const cookieOptions = { expires: 7, domain: process.env.REACT_APP_DOMAIN, secure: true };
      Cookies.set('user-id', data, cookieOptions);
      setIsLoading(false);
      navigate("/home");
    }).catch((err) => {
      setIsLoading(false);
      setError(err.message);
      setOpenErrorDialog(true);
      return false;
    });
  }

  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  function handleErrorDialogOk() {
    setOpenErrorDialog(false);
  }

  return isLoading ? (<LoadingComponent />) : (
    <Container maxWidth="false"
      sx={{
        width: 'clamp(350px,60%,40rem)',
        minHeight: '100vh', // weird
        padding: '1rem',
        paddingTop: isDesktopView ? '10%' : '0px'
      }}>
      <Typography
        variant="h1"
        sx={{ margin: isDesktopView ? '4rem' : '2rem', textAlign: 'center' }} >
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