const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        // Connect to Database 
        mongoose.connect(process.env.MongoURI, {}).then(() => {
            console.log("Connected to database")
        })
    } catch (error) {
        console.error('Error connecting to database', error)
    }

}

module.exports = connectDB;