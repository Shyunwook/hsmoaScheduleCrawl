const express = require('express');
const handler = require('./index');
const engine = require('ejs-locals');
const path = require('path');

const app = express();
const port = 3000;

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', async(req, res) => {
    handler.handler("",{env : "dev", res : res});
})

app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
})

