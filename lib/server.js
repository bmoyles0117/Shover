var app = require('express')(), 
    argv = require('optimist').argv,
    server = require('http').createServer(app), 
    io = require('socket.io').listen(server),
    node_port = argv.port || 8000;

console.log('Listening on: ' + node_port);

server.listen(node_port);

app.use(function(req, res, next) {
    var data = '';
    
    req.setEncoding('utf8');
    
    req.on('data', function(chunk) { 
        data += chunk;
    });
    
    req.on('end', function() {
        req.rawBody = data;
        next();
    });
});

app.post('/trigger/:channel_name/:event_name', function (req, res) {
    io.sockets.emit(req.param('channel_name') + '_' + req.param('event_name'), JSON.parse(req.rawBody));
    
    res.send('OK');
});

io.configure(function () {
    io.set('authorization', function (handshakeData, callback) {
        callback(null, true);
    });
});

io.sockets.on('connection', function (socket) {
});