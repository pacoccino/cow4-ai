var EOF = "#end#";

function CommunicationMock(socket) {
    self.myId = null;
}

CommunicationMock.prototype.send = function(data, callback) {

    callback();
};

CommunicationMock.prototype.setListener = function(listener, listenerScope) {
    if(listener) {
        this.listener = listener;
        this.listenerScope = listenerScope;
    }
    else {
        this.listener = null;
    }
};

CommunicationMock.prototype.getId = function() {

    return this.myId;
};

CommunicationMock.prototype.setId = function(id) {

    this.myId = id;
};

module.exports = Communication;
