const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./helpers/uuid');
const { readAndAppend, writeToFile } = require('./public/assets/js/utils');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// GET for notes.html
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route to get all of the notes
app.get('/api/notes', (req, res) => 
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err) return console.log(err);
        // console.log(data)
        res.json(JSON.parse(data))
    })    
);

app.delete('/api/notes/:id', (req, res) => {
  console.log(req.params.id);
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if(err) return console.log(err);
    // console.log(data)
    var dataParse = JSON.parse(data);

    var array = [];

    for(var i = 0; i < dataParse.length; i++) {
      // console.log(dataParse[i]);
      if(req.params.id != dataParse[i].id) {
        array.push(dataParse[i]);
      }
    }
    // console.log('Old List', dataParse)
    // console.log('New List', array)

    writeToFile('./db/db.json', array);
    res.json('deleted');

  });
});

// post for /api/notes
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      
    // reads the db file and appends the new data
    readAndAppend(newNote, './db/db.json');
      
    const response = {
      status: 'success',
      body: newNote,
    };

      // log the new body data to see if correct data is coming through
      res.status(201).json(response);
      } else {
      res.status(500).json('Error in posting note');
      }
});

// wildcard GET
app.get('*', (req, res) => 
res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.info(`Example app listening at http://localhost:${PORT}`)
);
