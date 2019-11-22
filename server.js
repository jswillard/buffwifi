var express = require('express');
var app = express();
let path = require('path');

var port = 3000;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
