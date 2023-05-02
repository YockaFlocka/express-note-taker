const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./helpers/uuid');
const { readAndAppend } = require('./public/assets/js/utils');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// brings you to the notes.html page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route to get all of the notes
app.get('/api/notes', (req, res) => 
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err) return console.log(err);
        console.log(data)
        res.json(JSON.parse(data))
    })    
);

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
      
    readAndAppend(newNote, './db/db.json');
    res.json('Posted note to list');
    
    
    // Convert the data to a string so we can save it
    // const noteString = JSON.stringify(newNote);

    // Write the string to db.json file
    // fs.readFile('./db/db.json', 'utf8', (err, data) => {
    //     if (err) {
    //       console.error(err);
    //     } else {
    //       // Convert string into JSON object
    //       const parsedNotes = JSON.parse(data);
  
    //       // Add a new note
    //       parsedNotes.push(newNote);
  
    //       // Write updated reviews back to the file
    //       fs.writeFile(
    //         './db/db.json',
    //         JSON.stringify(parsedNotes, null, 4),
    //         (writeErr) =>
    //           writeErr
    //             ? console.error(writeErr)
    //             : console.info('Successfully updated notes!')
    //       );
    //     }
    //   });
  
      const response = {
        status: 'success',
        body: newNote,
      };

      // log the new body data to see if correct data is coming through
    //   console.log(response);
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
