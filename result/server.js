const express = require('express'),
    async = require('async'),
    pg = require("pg"),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server)
    ResultService = require('./api/services/result-service.js');

io.set('transports', ['polling']);

var port = process.env.PORT || 4000;
var PG_HOST = process.env.PG_HOST || 'localhost';
var PG_USER = process.env.PG_USER || 'admin';
var PG_PASSWORD = process.env.PG_PASSWORD || 'admin';

io.sockets.on('connection', function (socket) {

  socket.emit('message', { text : 'Welcome!' });

  socket.on('subscribe', function (data) {
    socket.join(data.channel);
  });
});

async.retry(
  {times: 1000, interval: 1000},
  function(callback) {
    console.log(`connecting to: postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}/vote`);
    pg.connect(`postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}/vote`, function(err, client, done) {
      if (err) {
        console.error(err)
        console.error("Waiting for db");
      }
      callback(err, client);
    });
  },
  function(err, client) {
    if (err) {
      return console.err("Giving up");
    }
    console.log("Connected to db");
    client.query('CREATE TABLE IF NOT EXISTS votes ( id int, vote character(1));')
    getVotes(client);
  }
);

function getVotes(client) {
  client.query('SELECT vote, COUNT(id) AS count FROM votes GROUP BY vote', [], function(err, result) {
    if (err) {
      console.error("Error performing query: " + err);
    } else {
      var votes = collectVotesFromResult(result);
      io.sockets.emit("scores", JSON.stringify(votes));
    }

    setTimeout(function() {getVotes(client) }, 1000);
  });
}

function collectVotesFromResult(result) {
  var votes = {a: 0, b: 0};

  result.rows.forEach(function (row) {
    votes[row.vote] = parseInt(row.count);
  });

  return votes;
}

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/views/index.html'));
});

app.get('/api/v1/results/',function (req,res) {
  res.setHeader('Content-Type','application/JSON');
  ResultService.getResult(`postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}/vote`)
    .then((resultVote) => {
        console.log(resultVote)
        res.send(resultVote);
    })
});

server.listen(port, function () {
  var port = server.address().port;
  console.log('App running on port ' + port);
});
