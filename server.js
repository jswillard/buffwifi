const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const schedule = require('node-schedule');
const csv = require('csv-parser');

let app = express();

var port = process.env.PORT || 3000;

var date = new Date();

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
})

var testTimes = [];

console.log(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());

fs.createReadStream('results.csv').pipe(csv()).on('data', (row) => {
    console.log(row);
    console.log(row["ispName"]);
  }).on('end', () => {
    console.log('CSV file successfully processed');
  });
/*
const file = fs.createWriteStream("results.csv");
const request = https.get("https://account.speedtestcustom.com/api/test/77761/export/latest?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik1qaEVSVFF4TkRVeU5qTXhRVE0zUWtJeFJETkNRVVk1UlRaQ016VkJNemhHT1RNMU5rUkNRUSJ9.eyJodHRwczovL2FjY291bnQub29rbGEuY29tL2NyZWF0aW9uRGF0ZSI6IjIwMTktMTEtMTJUMDE6MzU6MTcuOTQ0WiIsImh0dHBzOi8vYWNjb3VudC5vb2tsYS5jb20vbG9naW5zQ291bnQiOjMsImh0dHBzOi8vYWNjb3VudC5vb2tsYS5jb20vbGFzdExvZ2luIjoxNTc0NzAwMjU4NDg0LCJpc3MiOiJodHRwczovL29va2xhLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZGNhMGM1NTFkZDI2YzBlNmRiMGYyZGIiLCJhdWQiOlsiaHR0cHM6Ly9hcGkuc3QtY29ubmVjdC5jb20iLCJodHRwczovL29va2xhLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1NzQ3MDAyNTgsImV4cCI6MTU3NDcwNzQ1OCwiYXpwIjoicVoyMnJMUTNIbVkxMDJRTjA1RElRR3FGa3ozQUhkRnIiLCJzY29wZSI6Im9wZW5pZCJ9.Ula39cNgDBr3f2VJAur4Mo91M12TFaemPrIjaqRmaoH7sO4TnHm0E6mrP2373F-dviaHRGKDA2UY65XkraOa_s97YoLohhgrmmQ1dMRuuSxWL0GyApFolKh8FnE6l5J5PDGajr_UVUMuZuhBBHfWd3SmHeNZEQJ9QOGxHiFfILEeftgY3ZaR7RQhj7Ghm49ClbGvu6m9mhX_0PtPZ1lnc4vIBh8fOxy7OiaJvTdCDU9kLHrh7Edap9HEGYhBSlKwu0RXo8P9_03ozahPI4V4r1X3I4HpOC9hCvW2KQqiEMTJkvyZ-JRRBHOIbmOm1fdA1HMr2r23f-c-fJ_u6mfO6w", function(response) {
  response.pipe(file);
  fs.readFile('results.csv', 'utf8', function(err, contents) {
    console.log(contents);
    contents = d3n.csv.parse(contents);
    console.log(data[0])
  });
});

var j = schedule.scheduleJob('*1 * * * *', function(){
  console.log(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
});
*/
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
