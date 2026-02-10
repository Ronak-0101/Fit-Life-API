const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            userNewUrlParser:  true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    }catch(err) {
        console.error('MongoDB connection error : ',err);
        process.exit(1);
    }
}

module.exports = connectDb;