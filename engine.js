var express = require("express");
var logfmt = require("logfmt");
var url = require('url');
var app = express();

var exprs = [
  {
    pattern: /^diff$/,
    url: function() { return 'https://phab.trifacta.com/differential/'; },
  },
  {
    pattern: /^[dD][0-9]+$/,
    url: function(inp) { return 'https://phab.trifacta.com/' + inp.toUpperCase(); },
  },
  {
    pattern: /^macro .+$/,
    url: function(inp) {
      return 'https://phab.trifacta.com/macro/?nameLike=' + inp.slice(6, inp.length);
    },
  },
  {
    pattern: /^macro$/,
    url: function() { return 'https://phab.trifacta.com/macro/'; },
  },
  {
    pattern: /^[pP][rR][0-9]*$/,
    url: function(inp) {
      return 'https://bitbucket.org/trifacta/trifacta/pull-request/' + inp.slice(2, inp.length);
    },
  },
  {
    pattern: /^[#][0-9]+$/,
    url: function(inp) {
      return 'https://bitbucket.org/trifacta/trifacta/pull-request/' + inp.slice(1, inp.length);
    },
  },
  {
    pattern: /^[tT][dD][-][0-9]+$/,
    url: function(inp) { return 'https://trifacta.atlassian.net/browse/' + inp; },
  },
  {
    pattern: /^t$/,
    url: function() { return 'https://trifacta.atlassian.net/issues/?filter=-1'; },
  },
  {
    pattern: /^w .+$/,
    url: function(inp) {
      return 'https://trifacta.atlassian.net/wiki/dosearchsite.action?queryString=' +
          inp.slice(2, inp.length);
    },
  },
  {
    pattern: /^w$/,
    url: function() { return 'https://trifacta.atlassian.net/wiki/'; },
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
      return res.redirect(expr.url(query));
    }
  }

  res.redirect('https://www.google.com/search?q=' + query);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
