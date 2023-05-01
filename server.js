const express = require('express');
const path = require('path');
// const api = require('./Develop/public/assets/js/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use('/api', api);


app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/Develop/public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/Develop/public/notes.html'))
);






app.listen(PORT, () =>
  console.info(`Example app listening at http://localhost:${PORT}`)
);