const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const pug = require('pug');
const pgp = require('pg-promise')();

let app = express();

var port = process.env.PORT || 3000;

var date = new Date();

const cn = {
    host: 'localhost', // 'localhost' is the default;
    port: 5432, // 5432 is the default;
    database: 'database',
    user: 'admin',
    password: 'password'
};

let db = pgp(process.env.DATABASE_URL || cn);

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.get('/results', function(req, res) {
  var latitude = req.query.lat;
  var longitude = req.query.long;
  var upload = req.query.up;
  var download = req.query.down;
  var ping = req.query.ping;

  res.sendFile(path.join(__dirname + '/views/SpeedTestResults.html'));
});

app.get('/chart', function(req, res) {
  var loc = req.query.loc;

  db.any("SELECT avg(download) as down, avg(upload) as up, EXTRACT(hour from time_stamp) as hour FROM speedtests WHERE location='" + loc + "' GROUP BY EXTRACT(hour from time_stamp)")
    .then(function(data) {
      var temp = new Array();
      for (var i = 0; i < data.length; i++){
        temp.push([data[i]['hour'].toString(), data[i]['down'], data[i]['up']]);
      }
      res.render('chart', {arr: temp, loc: loc});
    })
    .catch(function(error) {
      console.log(error);
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
