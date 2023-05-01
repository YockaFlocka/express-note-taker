const express = require('express');
const path = require('path');
const fs = require('fs');
const dbData = require('./db/db.json');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// brings you to the index.html page
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// brings you to the notes.html page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route to get all of the notes
app.get('/api/notes', (req, res) => 
    res.json(dbData)
);

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
      
    // Convert the data to a string so we can save it
    // const noteString = JSON.stringify(newNote);

    // Write the string to db.json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new note
          parsedNotes.push(newNote);
  
          // Write updated reviews back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };

      // log the new body data to see if correct data is coming through
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });


app.listen(PORT, () =>
  console.info(`Example app listening at http://localhost:${PORT}`)
);
