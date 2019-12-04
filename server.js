const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const pug = require('pug');
const pgp = require('pg-promise')();

const express = require('express');
let app = express();

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'database',
	user: 'admin',
	password: 'password'
};

let db = pgp(dbConfig);

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

app.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname+'views/index.html'));

});

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
        res.render('pages/SpeedTestResults',{
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
            res.render('pages/SpeedTestResults');
    });
});

app.get('/home/showAll', function(req, res) {
	var data =  'SELECT * FROM location_data;';
	db.task('get-everything', task => {
        return task.batch([
            task.any(data),
        ]);
    })
    .then(info => {
        res.render('pages/home')
        console.log(info)
    })
    .catch(error => {
        // display error message in case an error
        console.log("Na fam, your shit broke.", error)
        res.render('pages/home')
    });
});

<<<<<<< HEAD
const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'database',
	user: 'admin',
	password: 'password'
};

let db = pgp(dbConfig);

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/'));

app.get('/test', function(req, res) {
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
        res.render('views/SpeedTestResults',{
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
            res.render('pages/SpeedTestResults');
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
=======

app.listen(3000);
console.log('3000 is the magic port');
>>>>>>> f320ca13f274c5c5ca16e7220f91e8772a5ea91a
