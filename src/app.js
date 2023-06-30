require('dotenv').config()
const express = require('express');

const routes = require('./routes');
const connectDB = require('./lib/db');

const app = express();
const PORT = 5000

// Connect to Database
connectDB()

// Middlewares 
app.use(express.json())

// Routes
app.use('/api', routes);


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    return res.status(500).send({ 
        status : 'failed',
        message : 'Something went wrong',
    })
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

