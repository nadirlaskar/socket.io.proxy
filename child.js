var server = require('http').createServer();
var port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
    start("server", server);
});


const start = (m, server) => {
    if (m === 'server') {
        const io = require('socket.io')();
        io.serveClient(false);
        io.attach(server);
        setup(io);
    }
}

const setup = (io) => {
    io.on('connection', (socket) => {
        process.send({ connect: socket.id });
        socket.use((packet, next) => {
            process.send({
                socket: socket.id,
                event: packet[0],
                data: packet[1]
            })
            next();
        });

        ["disconnect"].forEach(e => { //add other system event to proxy
            socket.on(e, () => {
                process.send({
                    socket: socket.id,
                    event: e,
                    data: e
                })
            })
        })
    });


    process.on("message", ({ name, message, broadcast, socket }) => {
        if (broadcast) {
            io.sockets.connected[socket]
                ? io.sockets.connected[socket].broadcast.emit(name, message)
                : io.sockets.emit(name, message);
        }
        else io.sockets.connected[socket].emit(name, message);
    })
}