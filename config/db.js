const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    }catch(err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDb;