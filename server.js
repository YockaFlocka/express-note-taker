const express = require('express');
const path = require('path');
const fs = require('fs');
const dbData = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

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
      };

    // Convert the data to a string so we can save it
    const noteString = JSON.stringify(newNote);

    // Write the string to db.json file
    fs.writeFile(`./db/${newNote}.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(
            `POST for ${newNote} has been written to JSON file`
          )
    );
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });


app.listen(PORT, () =>
  console.info(`Example app listening at http://localhost:${PORT}`)
);
