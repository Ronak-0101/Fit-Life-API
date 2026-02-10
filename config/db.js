const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    }catch(err) {
        console.error('MongoDB connection error:', err.message);
        if (err.stack) {
            console.error(err.stack);
        }
        process.exit(1);
    }
}

module.exports = connectDb;