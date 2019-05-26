const subprocess = require('child_process').fork('child.js', [], { execArgv: ["--inspect-brk"] });

// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

subprocess.on("message",(data)=>{
  console.log(data);
})