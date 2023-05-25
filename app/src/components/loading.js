import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';


export default function Loading(){
  
  return (
    <Container maxWidth="false"
      sx={{
        width: 'clamp(350px,80%,60rem)',
        minHeight: '100vh', // weird
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <CircularProgress color='primary'/>
    </Container>
  );
}