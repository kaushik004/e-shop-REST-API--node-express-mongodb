const express = require('express');
require('dotenv/config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// importing routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');


const app = express();
const PORT = process.env.PORT || 3000;
const api = process.env.API_URL;

// mongodb connection
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Database is connected successfully....');
})
.catch((err) => {
    console.log(err);
})

// Using cors
app.use(cors());
app.options('*', cors()); // allowing all other http request from any other origin 
// Body Parser
app.use(express.json());
// Morgan for logging
app.use(morgan('tiny'));

// Routes
app.use(`${api}/categories`, categoryRoutes);
app.use(`${api}/products`, productRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/orders`, orderRoutes);

app.listen(PORT, () => {
    console.log(`Server is running http://127.0.0.1:${PORT}`);
});