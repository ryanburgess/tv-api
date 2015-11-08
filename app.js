var express = require('express');
var app = express();
var cheerio = require('cheerio');
var request = require('request');
var schedule = [];

var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

var newDate = month + '/' + day + '/' + year;

app.get('/', function (req, res) {
  res.send('<a href="/api/">TV API</a>');
});

app.get('/api/', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  var qr = req.query.date;
  
  if(qr !== undefined){
    newDate = qr;
  }
  request({
    method: 'GET',
    url: 'http://www.tvmuse.com/schedule.html?date=' + newDate
    }, function(err, response, body, callback) {
      if (err) return console.error(err);
      $ = cheerio.load(body);

      $('.table_schedule .cfix').each(function(key){
        var title = $(this).find('.c1').text();
        var episode = $(this).find('.c2').text();
        var episodeTitle = $(this).find('.c3').text().trim();
        var time = $(this).find('.c4').text();
        var network = $(this).find('.c5').text().trim();
        schedule.push({show: title, episode: episode, episode_title: episodeTitle, time: time, network: network, date: newDate})
      });
  });
  res.send(JSON.stringify(schedule, null, 4));
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('listening on port ' + port);
});
