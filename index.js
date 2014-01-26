var path = require('path');
var fs = require('fs');
var mime = require('mime');
var VisualPhpProxy = require('visualphp-proxy');

var useBuild = (process.argv.length > 2 && process.argv[2] === 'build');

var proxy = new VisualPhpProxy({
  hostname: 'agecom.dynamic-software.cz',
  minimizeHtml: useBuild
});

var urlPrefix = 'http://' + proxy.hostname;

var scriptSrcPrefix = urlPrefix + '/js/';
proxy.addHtmlFilter(function localizeScripts($) {
  $('script').each(function() {
    var src = $(this).attr('src');
    if (src && src.slice(0, scriptSrcPrefix.length) === scriptSrcPrefix) {
      $(this).attr('src', src.slice(urlPrefix.length));
    }
  });
});

var linkHrefPrefix = urlPrefix + '/repository/styles/';
proxy.addHtmlFilter(function localizeStyles($) {
  $('link').each(function() {
    var href = $(this).attr('href');
    if (href && href.slice(0, linkHrefPrefix.length) === linkHrefPrefix) {
      $(this).attr('href', href.slice(urlPrefix.length));
    }
  });
});

if (useBuild) {
  proxy.addHtmlFilter(function addBuild($) {
    $('script[src="/js/kontakt.js"]').remove();
    $('script[src="/js/dochlin.js"]').remove();
    $('script[src="/js/anim-hover.js"]').remove();
    $('script[src="/js/banner.js"]').remove();
    //$('script[src="/js/anim-vyrabene-dily.js"]').remove();

    $('head').append('<script src="/build/scripts.js"></script>');
    $('link[href="/repository/styles/banner.css"]').attr('href', '/build/styles.css');
  });
}
else {
  proxy.addHtmlFilter(function removeUnusedScripts($) {
    $('script[src="/js/kontakt.js"]').remove();
    $('script[src="/js/dochlin.js"]').remove();
    $('head').append('<script src="/js/anim-hash.js"></script>');
    //$('head').append('<script src="/js/anim-vyrabene-dily.js"></script>');
  });
}

var anchorHrefPrefix = urlPrefix + '/';
proxy.addHtmlFilter(function addNewScript($) {
  $('a').each(function() {
    var href = $(this).attr('href');
    if (href && href.slice(0, anchorHrefPrefix.length) === anchorHrefPrefix) {
      $(this).attr('href', href.slice(urlPrefix.length));
    }
  });
});

proxy.addHtmlFilter(function prepareForAnimHash($) {
  $('a[name=kontakt]').removeAttr('name').addClass('kontakt-anim-hash');
  $('div.hlinik').addClass('dochlin-anim-hash');
});

proxy.on('proxyRequest', function getLocalJavascript(event) {
  var requestMethod = event.requestOptions.method;
  var requestPath = event.requestOptions.path;
  var response = event.response;

  if (requestMethod === 'GET') {
    if ((requestPath.slice(0, 4) === '/js/' && requestPath.slice(-4) !== '.map')
        || (requestPath === '/repository/styles/banner.css')
        || (requestPath.slice(0, 7) === '/build/')) {
      respondWithLocalFile(requestPath, response);
      event.stopEvent();
    }
  }
});

function respondWithLocalFile(requestPath, response) {
  var file, fileStream, type;

  file = path.join(__dirname, requestPath);
  type = mime.lookup(requestPath);
  if (fs.existsSync(file)) {
    response.writeHead(200, {
      'Content-Type': type + (type.slice(0, 5) === 'text/' ? '; charset=utf-8' : ''),
      'Transfer-Encoding': 'chunked'
    });
    fileStream = fs.createReadStream(file);
    fileStream.pipe(response);
  }
  else {
    response.writeHead(404);
    response.end();
  }
}

proxy.listen(process.env.AGECOM_PROXY_PORT || 8000, 'localhost');
