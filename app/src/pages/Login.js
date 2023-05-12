import * as React from 'react';
import { Typography, Container } from "@mui/material";
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');


  useEffect(() => {
    fetch('http://localhost:8000/users/1')
      .then(response => {
        return response.json();
      })
      .then(data => {
        
      });
  }, []);

  function handleLogin() {
    // make a request with email

    // check that the password matches the email

    // go to home
    navigate("/home");

    //else show error dialog
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
            onClick={handleLogin}
            type='submit'
            sx={{ margin: '0.5rem' }}
          >Login</Button>
          <Button
            variant="contained"
            href="/signup"
            sx={{ margin: '0.5rem' }}
          >Sign Up</Button>
        </Stack>
    </Container>
  )
}