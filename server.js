const express = require('express');
let app = express();
let path = require('path');

var port = process.env.PORT || 5000;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
