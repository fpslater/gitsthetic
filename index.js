var express = require('express'),
    GitHub = require('github-api'),
    bodyParser = require('body-parser');

var server = express(),
    port = 8000,
    gh = new GitHub();

server.use(bodyParser());

server.use(express.static(__dirname + '/public'));

server.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

server.listen(port, function() {
  console.log('server listening on port ' + port);
});

server.post('/login', function(req, res) {
  var user = gh.getUser(req.body.user);
  user.listRepos(function(err, repos) {
    res.json(repos);
  });
});

var user = gh.getUser('fpslater');
