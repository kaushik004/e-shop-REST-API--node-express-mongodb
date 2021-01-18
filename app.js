const express = require('express');
require('dotenv/config');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;
const api = process.env.API_URL;

// Body Parser
app.use(express.json());
// Morgan for logging
app.use(morgan('tiny'));

// http://127.0.0.1/api/v1/products
app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'hair dresser',
        image: 'url_url'
    }
    res.send(product);
});

app.post(`${api}/products`, (req, res) => {
    const newProduct = req.body
    console.log(newProduct);
    res.send(newProduct);
});

app.listen(PORT, () => {
    console.log(`Server is running http://127.0.0.1:${PORT}`);
});