var Shover = function() {
    this.socket = io.connect(Shover.domain + ':' + Shover.port);
}

Shover.domain = '';
Shover.port = 8000;

Shover.configure = function(domain, port) {
    Shover.domain = domain || '';
    Shover.port = port || 8000;
}

Shover.prototype.subscribe = function(channel_name) {
    this.socket.emit('subscribe', {
        channel_name    : channel_name
    });
    
    return new ShoverChannel(this, channel_name);
}

var ShoverChannel = function(shover, channel_name) {
    this.shover = shover;
    this.channel_name = channel_name;
    this.events = {};
}

ShoverChannel.prototype.bind = function(event_name, callback) {
    this.events[event_name] = this.events[event_name] || [];
    this.events[event_name].push(callback);

    this.shover.socket.addListener(this.get_channel_name(event_name), callback);
}

ShoverChannel.prototype.get_channel_name = function(event_name) {
    return this.channel_name + '_' + event_name;
}

ShoverChannel.prototype.unbind = function(event_name, callback) {
    if(!this.events[event_name])
        return true;
        
    var callbacks = callback ? [callback] : this.events[event_name].slice(0);
    
    for(var i = 0; i < callbacks.length; i++) {
        this.events[event_name].splice(this.events[event_name].indexOf(callbacks[i]), 1);
        this.shover.socket.removeListener(this.get_channel_name(event_name), callbacks[i]);
    }
}