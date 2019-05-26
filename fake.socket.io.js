
function Socket(socket, subprocess) {
    this.map = {};
    this.on = (name, callback) => { this.map[name] ? this.map[name].push(callback) : this.map[name] = [callback]; };
    this.emit = (name, message, broadcast = false) => {
        subprocess.send({ name, message, broadcast, socket })
    }
    this.broadcast = { emit: (name, message) => this.emit(name, message, true) };
}

Socket.prototype.fire = function (event, data) {
    this.map[event].forEach(cb => cb(data));
}

const socketMap = {};
module.exports = function (subprocess) {
    this.map = {};
    this.on = (name, callback) => { this.map[name] ? this.map[name].push(callback) : this.map[name] = [callback]; };
    subprocess.on("message", (data) => {
        if (data.connect) {
            socketMap[data.connect] = new Socket(data.connect, subprocess);
            this.map["connection"].forEach(cb => cb(socketMap[data.connect]));
        } else {
            socketMap[data.socket].fire(data.event, data.data);
        }
    });
}