const Status = require('../schemaes/status');

let io;

exports.setIO = function(socketIO){
    io = socketIO;
}

exports.register = function(socket){
    socket.on('listen',(statuses) => {
        if(!Array.isArray(status)){
            statuses = [statuses]
        }
        statuses.forEach(status => {
            socket.join(status)
        });
    });
    socket.on('test',function(data){
        console.log(data)
        socket.emit('test',data)
        socket.broadcast.emit('test', data);
    })
    socket.on('MapStatus',function(data){
        console.log(data)
        socket.emit('MapStatus',data)
        socket.broadcast.emit('MapStatus', data);
    })

        /**
     * Remove a status with given data
     * @param status: name of the status to remove
     * @param keys: an array of keys to remove, with an empty one means remove the whole status
     * 
     * @return 'removeFailed' message with keys that were not found
     * @return 'removeOk' message to the sender
     */
    socket.on('remove', (req) => {
        console.log(req);
        Status.remove(req.status, (error) => {
            if (error) {
                console.log(error)
                socket.emit('failure', 'Remove failed: ' + error);
                socket.broadcast.emit('failure', 'Remove failed: ' + error);
            } else {
                socket.emit('removeOk');
                socket.broadcast.emit('removeOk', data);
            }
        });
    });
}