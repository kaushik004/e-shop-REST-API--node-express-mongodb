const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello Api !!');
});

app.listen(PORT, () => {
    console.log(`Server is running http://127.0.0.1:${PORT}`);
});