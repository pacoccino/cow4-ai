var EOF = "#end#";

function Communication(socket) {
    var self = this;

    self.socket = socket;

    self.socket.on('data', function(buffer) {
        var data = self.unFormat(buffer);

        if(self.listener) {
            self.listener(data);
        }
        else {
            console.log("Data received without listener", data);
        }
    });
}

Communication.prototype.format = function(message) {

    var messageString = JSON.stringify(message);
    messageString = messageString + EOF;

    return messageString;
};

Communication.prototype.unFormat = function(buffer) {
    var message = buffer.toString();
    if(message.indexOf(EOF) === -1) {
        console.error("Incorrect message");
        return {};
    }

    var truncMess = message.substr(0, message.length - EOF.length);

    return JSON.parse(truncMess);
};

Communication.prototype.send = function(data, callback) {

    this.socket.write(this.format(data), 'utf-8', callback);
};

Communication.prototype.setListener = function(listener) {
    if(listener) {
        this.listener = listener;
    }
    else {
        this.listener = null;
    }
};

Communication.prototype.getId = function() {

    return this.AiId;
};

Communication.prototype.setId = function(id) {

    this.AiId = id;
};

module.exports = Communication;
