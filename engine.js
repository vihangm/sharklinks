var express = require("express");
var logfmt = require("logfmt");
var app = express();

function startsWith(str, starts){
  if (starts === '') return true;
  if (str == null || starts == null) return false;
  str = String(str); starts = String(starts);
  return str.length >= starts.length && str.slice(0, starts.length) === starts;
}

function diff(res, param) {
  return res.redirect('https://phab.trifacta.com/' + param.toUpperCase());
}

function alldiffs(res) {
  return res.redirect('https://phab.trifacta.com/differential/');
}

function macro(res, param) {
  if (param) {
    return res.redirect('https://phab.trifacta.com/macro/?nameLike=' + param);
  }
  return res.redirect('https://phab.trifacta.com/macro/');
}

function issue(res, param) {
  if (param) {
    return res.redirect('https://trifacta.atlassian.net/browse/' + param);
  }
  return res.redirect('https://trifacta.atlassian.net/issues/?filter=-1');
}

function conf(res, param) {
  if (param) {
    return res.redirect('https://trifacta.atlassian.net/wiki/dosearchsite.action?queryString=' + param);
  }
  return res.redirect('https://trifacta.atlassian.net/wiki/');
}

function pr(res, param) {
  if (param) {
    return res.redirect('https://bitbucket.org/trifacta/trifacta/pull-request/' + param + '/');
  }
  return res.redirect('https://bitbucket.org/trifacta/trifacta/pull-requests');
}

app.use(logfmt.requestLogger());

app.get('/ping', function(req, res) {
  res.send('I AM ALIVE');
});

app.get('/search', function(req, res) {
  var query = req.query.q
  if (query === 'diff') {
    return alldiffs(res);
  }
  if (query === 't') {
    return issue(res);
  }
  if (startsWith(query, 'd') || startsWith(query, 'D')) {
    return diff(res, query);
  }
  if (startsWith(query, 'TD-')) {
    return issue(res, query);
  }
  if (startsWith(query, 'PR')) {
    return pr(res, query.slice(2, query.length));
  }
  if (startsWith(query, 'w ')) {
    return conf(res, query.slice(2, query.length));
  }
  if (startsWith(query, 'macro ')) {
    return macro(res, query.slice(6, query.length));
  }
  if (query === 'macro') {
    return macro(res);
  }
  res.redirect('https://www.google.com/search?q=' + req.query.q)
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
