const Status = require('../schemaes/status');

let io;

exports.setIO = function(socketIO){
    io = socketIO;
    Status.setIO(io);
}


exports.register = function(socket){
    /**
     * Listen to a status, and get its lastest data
     * @param status: name of the status to listen on
     * 
     * @return message {{status}} with data Object to the sender
     */
    socket.on('listen',(statuses) => {
        if(!Array.isArray(statuses)){
            statuses = [statuses]
        }
        statuses.forEach((status) => {
            Status.findOne({
                name: status
            }).exec(function (err, res) {
                if (err || !res) {
                    socket.emit('failure', 'Listen failed: ' + err);
                } else {
                    socket.join(status);
                    // socket.emit(status, res.data);
                }
            });
        });
    });

    /**
     * Fetch a status manually
     * @param status: name of the status to update, insert if not existing
     * 
     * @return message {{status}} with data Object to the listeners
     */
    socket.on('fetch', (req) => {
        if (!Array.isArray(req)) {
            req = [req];
        }
        req.forEach(status => {
            Status.findOne({
                    name: status
                })
                .exec((error, result) => {
                    if (error || !result) {
                        socket.emit('failure', 'Status not found');
                    } else {
                        socket.emit(status, result.data);
                    }
                });
        });
    });

    /**
     * Update a status with given data, then broadcast to all clients listening on this status
     * @param status: name of the status to update, insert if not existing
     * @param data: js Object containing key-value pairs, only specified ones will be updated, insert if not existing
     * 
     * @return 'updateOk' message to the sender
     * @return message {{status}} with data Object to the listeners
     */
    socket.on('update', (req) => {
        Status.updateStatus(req.status, req.data, (error, result) => {
            if (error || !result) {
                socket.emit('failure', 'Update failed: ' + error);
            } else {
                socket.emit('updateOk');
            }
        });
    });

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
        Status.removeStatus(req.status, (error) => {
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