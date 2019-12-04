const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const pug = require('pug');
const pgp = require('pg-promise');

let app = express();

var port = process.env.PORT || 3000;

var date = new Date();

const dbConfig = process.env.DATABASE_URL;

let db = pgp(dbConfig);

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
	var insert_statement = "INSERT INTO location_data (upload, download, ping, times_stamp) VALUES ("+ upload + "," + download + "," + ping+ ", NOW()"+" ) ON CONFLICT DO NOTHING;";

	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
        ]);
    })
    .then(function() {
        res.render('SpeedTestResults',{
            lat:latitude,
            long:longitude,
            up:upload,
            down:download,
            ping:ping,
            time:getDateTime()
        });
        console.log("Adding entry into database");
    })
    .catch(error => {
        // display error message in case an error
            console.log("Na fam, your shit broke: ", error);
            res.render('SpeedTestResults');
    });
});

app.get('/', function(req, res) {
	var data =  'SELECT * FROM location_data;';
	db.task('get-everything', task => {
        return task.batch([
            task.any(data),
        ]);
    })
    .then(info => {
        res.render('SpeedTestResults')
        console.log(info)
    })
    .catch(error => {
        // display error message in case an error
        console.log("Na fam, your shit broke.", error)
        res.render('SpeedTestResults')
    });
});

//testing purposes please ignore
app.get('/iframe', function(req, res) {
  var loc = req.query.loc;
  res.render('iframe', {location: loc});
});
//testing purposes please ignore
app.get('/iframetest', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/iframeParent.HTML'));
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
