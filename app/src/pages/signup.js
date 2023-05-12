import * as React from 'react';
import { Typography, Container } from "@mui/material";
import { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

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

  function handleSignUp() {
    navigate("/home");
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
          sx={{ margin: '0.5rem' }}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          required
          sx={{ margin: '0.5rem' }}
        />
        <TextField
          id="passwordCheck"
          label="Password"
          variant="outlined"
          type="password"
          required
          sx={{ margin: '0.5rem' }}
        />
        <Button
          variant="contained"
          onClick={handleSignUp}
          type='submit'
          sx={{ margin: '0.5rem' }}
        >Submit
        </Button>
        <Button
          variant="outlined"
          href="/login"
          type='submit'
          sx={{ margin: '0.5rem' }}
        >Login
        </Button>
      </Stack>
    </Container>
  )
}