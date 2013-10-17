var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8080;
 
var server = http.createServer(function(request, response) {
 
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
 
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';
 
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
 
      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));
 
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");


var io = require('socket.io').listen(server);

io.set('log level', 0);

io.sockets.on('connection', function (socket) {
  socket.emit('message', 'connected');
  socket.on('message', function (data) {
    console.log(data);
    var address = srv.address();
    var client = dgram.createSocket("udp4");
    var message = new Buffer(data);
    client.send(message, 0, message.length, address.port, address.address, function(err, bytes) {
      client.close();
    });
  });
});

var dgram = require('dgram');

//Initialize a UDP server to listen for json payloads on port 3333
var srv = dgram.createSocket("udp4");
srv.on("message", function (msg, rinfo) {
  console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
  io.sockets.emit('log', 'udp');
});

srv.on("listening", function () {
  var address = srv.address();
  console.log("server listening " + address.address + ":" + address.port);
});

srv.on('error', function (err) {
  console.error(err);
  process.exit(0);
});


srv.bind(3333,'ec2-23-23-187-109.compute-1.amazonaws.com');
//srv.bind(3333, function() {
  //srv.addMembership('10.164.112.120');
//});
