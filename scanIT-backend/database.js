require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const database = mongoose.connection;

database.on('error', (error) => {
    console.error('Database connection error:', error);
    process.exit(1);
});

database.once('open', function(){
    console.log('Database connected');
});

module.exports = database;