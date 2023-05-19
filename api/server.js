require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

// Login and Sign up
const authRouter = require('./routes/auth.js');
app.use('/auth', authRouter);

// Notes
const notesRouter = require('./routes/notes.js');
app.use('/notes', notesRouter);

// Tags
const tagsRouter = require('./routes/tags.js');
app.use('/tags', tagsRouter);

app.listen(8080, () => console.log('Server Started'));