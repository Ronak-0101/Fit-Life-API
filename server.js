require('dotenv').config();

const app = require('./app');
const connectDb = require('./config/db');
const routes = require('./routes');

connectDb();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})