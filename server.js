const express    = require('express');
const path       = require('path');
const bodyParser = require('body-parser');
const cors       = require('cors');

const app = express();
const users = require('./routes/users');

const port = 3000;


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); 

app.use('/api', users);

app.get('/', (req, res) => {
    res.send('Welcome');
});



app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
});