const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Db Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(errr => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
