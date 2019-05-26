const subprocess = require('child_process').fork('child.js',[],{execArgv:["--inspect-brk"]});

// Open up the server object and send the handle.
const server = require('http').createServer();
server.listen(8080, () => {
    console.log("listening on 1337");
    subprocess.send('server', server);
});