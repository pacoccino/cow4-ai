var EOF = '#end#';

function Communication(socket) {

    this.socket = socket;

    this.listener = null;

    var buffer = new Buffer(0);

    var bufferEnded = function() {
        var string = buffer.toString();
        return (string.indexOf(EOF) !== -1);
    };

    this.socket.on('data', function(receivedData) {
        buffer = Buffer.concat([buffer, receivedData]);

        if(bufferEnded()) {

            var data = this.unFormat(buffer);

            if(this.listener) {
                this.listener( data );
            }
            else {
                console.log('Data received without listener', data);
            }
            buffer = new Buffer(0);
        }
    }.bind(this));
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

Communication.prototype.setListener = function(listener) {
    this.listener = listener || null;
};

Communication.prototype.MyId = "defaultId";

module.exports = Communication;
