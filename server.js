const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const pug = require('pug');
const pgp = require('pg-promise')();

let app = express();

var port = process.env.PORT || 3000;

var now = new Date();

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

var buildings = ["Benson Earth Sciences",
"Clare Small",
"Cristol Chemistry and Biochemistry",
"Duane Physics and Astrophysics",
"Eaton Humanities",
"Economics",
"Education",
"Ekeley Science",
"Environmental Design",
"Fleming Law",
"Gold Biosciences",
"Guggenheim Geography",
"Hale Science",
"Hellems Arts and Sciences",
"Imig Music",
"JILA",
"Ketchum Arts and Sciences",
"Koelbel (Leeds School of Business)",
"Mathematics",
"McKenna Languages",
"Muenzinger Psychology",
"Norlin Library",
"Porter Biosciences",
"Ramaley Biology",
"ATLAS Center",
"Visual Arts Complex",
"Wolf Law",
"Museum Collections",
"Center for Academic Success & Engagement (CASE)",
"Rec Center",
"University Memorial Center (UMC)",
"Center for Community (C4C)",
"Engineering Center",
"Integrated Teaching & Learning Laboratory (ITLL)",
"Discovery Learning Center (DLC)"];

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.get('/results', function(req, res) {
  var download = req.query.down;
  var upload = req.query.up;
  var ping = req.query.ping;
  var loc = req.query.location;
  var date = (now.getMonth()+1)+'/'+now.getDate()+'/'+now.getFullYear();
  var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

  db.none('INSERT INTO speedtests (upload, download, ping, time_stamp, location) VALUES ($1, $2, $3, NOW(), $4)', [upload, download, ping, loc]);

  var query_best = "SELECT location, download as download FROM (SELECT DISTINCT ON (location) * FROM speedtests ORDER BY location, time_stamp DESC) t ORDER BY download DESC LIMIT 3;";
  var query_worst = "SELECT location, download as download FROM (SELECT DISTINCT ON (location) * FROM speedtests ORDER BY location, time_stamp DESC) t ORDER BY download LIMIT 3;";

  db.multi(query_best + query_worst)
    .then((temp) => {
      var data = []

      for (var i = 0; i < temp.length; i++){
        for (var j = 0; j < temp[i].length; j++){
          data.push(temp[i][j]['location']);
          data.push(temp[i][j]['download']);
        }
      }
      console.log(data);
      res.render('results',{up: upload, down: download, ping: ping, loc: loc, date: date, time: time, data: data});
    })
    .catch(error => {
      console.log(error);
      res.render('results');
    });

    //res.render('results', {up: upload, down: download, ping: ping, loc: loc, date: date, time: time});
});

app.get('/chart', function(req, res) {
  var loc = req.query.loc;
  var size = req.query.size;

  db.any("SELECT avg(download) as down, avg(upload) as up, EXTRACT(hour from time_stamp) as hour FROM speedtests WHERE location='" + loc + "' GROUP BY EXTRACT(hour from time_stamp) ORDER BY hour")
    .then(function(data) {
      var temp = new Array();
      for (var i = 0; i < data.length; i++){
        temp.push([data[i]['hour'].toString(), data[i]['down'], data[i]['up']]);
      }
      res.render('chart', {arr: temp, loc: loc, size: size});
    })
    .catch(function(error) {
      console.log(error);
    });
});

app.get('/data', function(req, res) {
  var most_recent = "SELECT location, download FROM\
      (SELECT DISTINCT ON (location) * \
      FROM speedtests \
      ORDER BY location, time_stamp DESC) t \
      ORDER BY time_stamp DESC;"
  db.any(most_recent)
    .then(function(data) {
      var fileName = './base_dataset_muninn.json';
      var file = require(fileName);

      var i = 0;
      var x = 0;
      var index;
      for (i = 0; i < 35; i++){
          flag = true;
          while(flag){
              if (file.features[x].properties.building != null){
                  index = getBuildingSpeed(file.features[x].properties.building, most_recent);

                  if(index != -1){
                      file.features[x].properties.download = most_recent[0][index];
                  }

                  else{
                      file.features[x].properties.download = 50;
                  }

                  fs.writeFile(fileName, JSON.stringify(file), function (err) {
                      if (err) return console.log(err);
                  });

                  flag = false;
                  x+=1;
              }
              else{
                  x += 1;
              }
          }
      }
      res.sendFile(path.join(__dirname + '/base_dataset_muninn.json'));
    })
    .catch(function(error) {
      console.log(error);
      res.sendFile(path.join(__dirname + '/base_dataset_muninn.json'));
    });
});

app.get('/map', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/map.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
