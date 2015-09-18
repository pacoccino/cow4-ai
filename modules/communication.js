var EOF = '#end#';

function Communication(socket) {
    var self = this;

    self.socket = socket;

    self.listener = null;
    self.listenerScope = null;
    self.myId = null;

    var buffer = new Buffer(0);

    var bufferEnded = function() {
        var string = buffer.toString();
        return (string.indexOf(EOF) !== -1);
    };

    self.socket.on('data', function(receivedData) {
        buffer = Buffer.concat([buffer, receivedData]);

        if(bufferEnded()) {

            var data = self.unFormat(buffer);

            if(self.listener) {
                self.listener.apply(self.listenerScope, [data]);
            }
            else {
                console.log('Data received without listener', data);
            }
            buffer = new Buffer(0);
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
        console.error('Incorrect message');
        return {};
    }

    var truncMess = message.substr(0, message.length - EOF.length);

    return JSON.parse(truncMess);
};

Communication.prototype.send = function(data, callback) {

    this.socket.write(this.format(data), 'utf-8', callback);
};

Communication.prototype.setListener = function(listener, listenerScope) {
    if(listener) {
        this.listener = listener;
        this.listenerScope = listenerScope;
    }
    else {
        this.listener = null;
    }
};

Communication.prototype.getId = function() {

    return this.myId;
};

Communication.prototype.setId = function(id) {

    this.myId = id;
};

module.exports = Communication;
