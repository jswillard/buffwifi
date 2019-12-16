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

var fs = require('fs');
// var fileName = './base_dataset_muninn.geojson';
// var file = require(fileName);

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

function getBuildingSpeed(currentBuilding, speeds){
    for (i=0; i< 35; i++){
        if (currentBuilding == speeds[0][i].location){
            return i;
        }
    }
    return -1;
}

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'suggestivelettuce',
	user: 'liam',
	password: 'Thebestdayever1!'
};

let db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory

app.get('/home', function(req, res) {
    // res.render('pages/home')
    res.sendFile(path.join(__dirname+'/views/pages/home.html'));
    
});

app.get('/homeresults', function(req, res) {
    var latitude = req.query.lat;
    var longitude = req.query.long;
    var upload = req.query.up;
    var download = req.query.down;
    var ping = req.query.ping;
    var insert_statement = "INSERT INTO location_data (upload, download, ping, time_stamp) VALUES ("+ upload + "," + download + "," + ping+ ", NOW()"+" ) ON CONFLICT DO NOTHING;";
    var best_speeds = "SELECT location, download as best_download FROM\
        (SELECT DISTINCT ON (location) * \
        FROM location_data \
        ORDER BY location, time_stamp DESC) t\
        ORDER BY download DESC LIMIT 3;"
    var worst_speeds = "SELECT location, download as worst_download FROM\
        (SELECT DISTINCT ON (location) * \
        FROM location_data \
        ORDER BY location, time_stamp DESC) t\
        ORDER BY download LIMIT 3;"
    var most_recent = "SELECT location, download FROM\
        (SELECT DISTINCT ON (location) * \
        FROM location_data \
        ORDER BY location, time_stamp DESC) t \
        ORDER BY time_stamp DESC;"

    var sql = most_recent + best_speeds + worst_speeds + insert_statement;

	db.multi(most_recent)
    .then((most_recent) => {
        res.render('pages/SpeedTestResults',{
            lat:latitude,
            long:longitude,
            up:upload,
            down:download,
            ping:ping,
            time:getDateTime()
        });
        console.log("Adding entry into database");
        // console.log(worst)
        // console.log(best)
        // console.log(most_recent[0])

        var fileName = './base_dataset_muninn.json';
        var file = require(fileName);

        var i = 0;
        var x = 0;
        var index;
        // console.log(getBuildingSpeed("JILA", most_recent))
        for (i = 0; i < 35; i++){
            flag = true;
            while(flag){
                if (file.features[x].properties.building != null){
                    index = getBuildingSpeed(file.features[x].properties.building, most_recent)
                    // console.log(most_recent[0][index])
                    // console.log(file.features[x].properties.building);
                    if(index != -1){
                        file.features[x].properties.download = most_recent[0][index];
                        console.log("test")
                    }
                    else{
                        file.features[x].properties.download = 50
                    }

                    fs.writeFile(fileName, JSON.stringify(file), function (err) {
                        if (err) return console.log(err);
                        // console.log(JSON.stringify(file));
                        // console.log('writing to ' + fileName);
                    });

                    flag = false;
                    x+=1;
                }
                else{
                    x += 1;
                }
            }
        }
    })
    .catch(error => {
        // display error message in case an error
            console.log("Na fam, your shit broke: ", error);
            res.render('pages/SpeedTestResults');
    });
});

app.listen(3000);
console.log('3000 is the magic port');
