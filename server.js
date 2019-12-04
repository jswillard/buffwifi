/**
 * Company: Suggestive Lettuce
 * Authors: Liam Nestelroad
 * Version: 1.2
 * 
 * Summary: This here is el carne y papas. The website will be hosted from this node js file using pug as the template engine and postgresql as the database. There are two different pug file: the first is the submit
 */

const express = require('express'); // Add the express framework has been added
let app = express();

const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

//Create Database Connection
const pgp = require('pg-promise')();
const path = require('path');
const pug = require('pug'); // Add the 'pug' view engine


/**********************
  
  Database Connection information

  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!

**********************/

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return Date(year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec);
}

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'suggestivelettuce',
	user: 'user',
	password: 'psw!'
};

let db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory

app.get('/home', function(req, res) {
    // res.render('pages/home')
    res.sendFile(path.join(__dirname+'/views/pages/chartExample.html'));
    
});

app.get('/homeresults', function(req, res) {
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


app.listen(3000);
console.log('3000 is the magic port');
