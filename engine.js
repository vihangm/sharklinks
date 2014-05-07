var express = require("express");
var logfmt = require("logfmt");
var url = require('url');
var app = express();

function startsWith(str, starts){
  if (starts === '') return true;
  if (str === null || starts === null) return false;
  str = String(str); starts = String(starts);
  return str.length >= starts.length && str.slice(0, starts.length) === starts;
}

var exprs = [
  {
    pattern: /^diff$/,
    url: 'https://phab.trifacta.com/differential/',
  },
  {
    pattern: /^[dD][0-9]+$/,
    url: 'https://phab.trifacta.com/',
    param: function(inp) { return inp.toUpperCase(); },
  },
  {
    pattern: /^macro .+$/,
    url: 'https://phab.trifacta.com/macro/?nameLike=',
    param: function(inp) { return inp.slice(6, inp.length); },
  },
  {
    pattern: /^macro$/,
    url: 'https://phab.trifacta.com/macro/',
  },
  {
    pattern: /^[pP][rR][0-9]*$/,
    url: 'https://bitbucket.org/trifacta/trifacta/pull-request/',
    param: function(inp) { return inp.slice(2, inp.length); },
  },
  {
    pattern: /^[#][0-9]+$/,
    url: 'https://bitbucket.org/trifacta/trifacta/pull-request/',
    param: function(inp) { return inp.slice(1, inp.length); },
  },
  {
    pattern: /^[tT][dD][-][0-9]+$/,
    url: 'https://trifacta.atlassian.net/browse/',
    param: function(inp) { return inp; },
  },
  {
    pattern: /^t$/,
    url: 'https://trifacta.atlassian.net/issues/?filter=-1',
  },
  {
    pattern: /^w .+$/,
    url: 'https://trifacta.atlassian.net/wiki/dosearchsite.action?queryString=',
    param: function(inp) { return inp.slice(2, inp.length); },
  },
  {
    pattern: /^w$/,
    url: 'https://trifacta.atlassian.net/wiki/',
  },
];

app.use(logfmt.requestLogger());

app.get('/ping', function(req, res) {
  res.send('I AM ALIVE');
});

app.get('/search', function(req, res) {
  var query = req.query.q;
  var parsed = url.parse(query);

  if (parsed.protocol) {
    return res.redirect(parsed.href);
  }

  for (var key in exprs) {
    var expr = exprs[key];
    if (expr.pattern.test(query)) {
      return expr.param ? res.redirect(expr.url + expr.param(query)) : res.redirect(expr.url);
    }
  }

  res.redirect('https://www.google.com/search?q=' + query);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
