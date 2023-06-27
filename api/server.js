require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
var cors = require('cors')

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// test route
app.get('/', async (req, res) => {
  // test
    return res.status(200).json("myNotes api is working");
});

// Login and Sign up
const authRouter = require('./routes/auth.js');
app.use('/auth', authRouter);

// Notes
const notesRouter = require('./routes/notes.js');
app.use('/notes', notesRouter);

// Tags
const tagsRouter = require('./routes/tags.js');
app.use('/tags', tagsRouter);

// Listen for connections
app.listen(8080, () => console.log('Server Started'));