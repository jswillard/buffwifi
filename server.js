const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

let app = express();

var port = process.env.PORT || 3000;

var date = new Date();

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
