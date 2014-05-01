var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('I AM ALIVE');
});

app.get('/search', function(req, res) {
  if (req.query.q[0] === 'D' || req.query.q[0] === 'd') {
    return res.redirect('https://phab.trifacta.com/' + req.query.q.toUpperCase());
  }
  res.redirect('https://www.google.com/search?q=' + req.query.q)
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
