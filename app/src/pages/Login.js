import * as React from 'react';
import { Typography, Container } from "@mui/material";
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import getFetch from '../requestHandlers';

export default function Login() {
  const navigate = useNavigate();

  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState(null);

  async function HandleLogin() {
    if (inputPassword === '') {
      setError('Please enter a password');
      setOpenErrorDialog(true);
      return false;
    }
    if (inputEmail === '') {
      setError('Please enter an email');
      setOpenErrorDialog(true);
      return false;
    }
    // make a request with email
    const response = await getFetch(inputEmail);

    // TODO: Differentiate between error and incorrect email

    if (response.error !== false) {
      setError(response.error);
      setOpenErrorDialog(true);
      return false;
    }

    const user_id = inputEmail;
    const retrievedPassword = response.data.password;
    // check that the password matches the email
    if (retrievedPassword !== inputPassword) {
      setError('Credentials are incorrect (password)');
      setOpenErrorDialog(true);
      return false;
    } 

    // go to home
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("loggedIn", true);
    navigate("/home");

    //else show error dialog
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
        sx={{ margin: '4rem', textAlign: 'center'}} >
        My Notes
      </Typography>
        <Stack
        sx={{ }}
        >
          <TextField 
            id="email" 
            label="Email" 
            variant="outlined" 
            type="email"
            required
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            sx={{margin: '0.5rem'}}
          />
          <TextField 
            id="password" 
            label="Password" 
            variant="outlined" 
            type="password"
            required
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            sx={{ margin: '0.5rem' }}
          />
          <Button 
            variant="contained"
            onClick={HandleLogin}
            type='submit'
            sx={{ margin: '0.5rem' }}
          >Login</Button>
          <Button
            variant="contained"
            href="/signup"
            sx={{ margin: '0.5rem' }}
          >Sign Up</Button>
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