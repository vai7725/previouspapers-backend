// packages
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

// modules
const router = require('./routes/route');
const connectDB = require('./db/connect');

// Environment Variables
const port = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Home route');
});

const start = async () => {
  try {
    await connectDB(dbURI);
    app.listen(port, () => console.log(`App started listening at ${port}`));
  } catch (error) {
    console.log('The error is', error);
  }
};

start();
