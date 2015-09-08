var EOF = "#end#";

function Communication(socket) {
    this.socket = socket;


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

Communication.prototype.listen = function(callback) {
    this.socket('data', function(data) {
        callback(this.unFormat(data));
    });
};

module.exports = Communication;
