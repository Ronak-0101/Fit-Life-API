require('dotenv').config();

const app = require('./app');
const connectDb = require('./config/db');
const routes = require('./routes');

// connectDb();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

// Connect DB AFTER server starts
connectDb().catch(err => {
  console.error("DB connection failed:", err.message);
});