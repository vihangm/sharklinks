var express = require('express');
var validUrl = require('valid-url');
var app = express();

var exprs = [
  {
    pattern: /^diff .+$/,
    url: function(inp) {
      return 'https://phab.trifacta.com/differential/?authors=' + inp.slice(5, inp.lenght);
    },
  },
  {
    pattern: /^diff$/,
    url: function() {
      return 'https://phab.trifacta.com/';
    },
  },
  {
    pattern: /^du .+$/,
    url: function(inp) {
      return 'https://phab.trifacta.com/diffusion/TF/browse/dev/' + inp.slice(3, inp.lenght);
    },
  },
  {
    pattern: /^[dD][0-9]+$/,
    url: function(inp) {
      return 'https://phab.trifacta.com/' + inp.toUpperCase();
    },
  },
  {
    pattern: /^macro .+$/,
    url: function(inp) {
      return 'https://phab.trifacta.com/macro/?nameLike=' + inp.slice(6, inp.length);
    },
  },
  {
    pattern: /^macro$/,
    url: function() {
      return 'https://phab.trifacta.com/macro/';
    },
  },
  {
    pattern: /^[tT][dD][-][0-9]+$/,
    url: function(inp) {
      return 'https://trifacta.atlassian.net/browse/' + inp;
    },
  },
  {
    pattern: /^t$/,
    url: function() {
      return 'https://trifacta.atlassian.net/issues/?filter=-1';
    },
  },
  {
    pattern: /^w .+$/,
    url: function(inp) {
      return 'https://confluence.trifacta.com/dosearchsite.action?queryString=' +
          inp.slice(2, inp.length);
    },
  },
  {
    pattern: /^w$/,
    url: function() {
      return 'https://confluence.trifacta.com/';
    },
  },
  {
    pattern: /^g .+$/,
    url: function(inp) {
      return 'https://www.google.com/search?q=' + encodeURIComponent(inp.slice(2, inp.length));
    },
  }
];

app.get('/ping', function(req, res) {
  res.send('I AM ALIVE');
});

app.get('/search', function(req, res) {
  console.log(req.query.q)
  var query = req.query.q;

  if (validUrl.isUri(query)) {
    return res.redirect(query);
  }

  for (var key in exprs) {
    var expr = exprs[key];
    if (expr.pattern.test(query)) {
      return res.redirect(expr.url(query));
    }
  }

  res.redirect('https://www.google.com/search?q=' + encodeURIComponent(query));
});

var port = Number(process.env.PORT || 8008);
app.listen(port, function() {
  console.log('Listening on ' + port);
});
