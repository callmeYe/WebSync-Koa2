let io;

exports.setIO = function(socketIO){
    io = socketIO;
}

exports.register = function(socket){
    // socket.on('listen',(statuses) => {
    //     if(!Array.isArray(status)){
    //         statuses = [statuses]
    //     }
    //     statuses.forEach(status => {
    //         socket.join(status)
    //     });
    // });
    socket.on('test',function(data){
        console.log(data)
        socket.emit('test',data)
        socket.broadcast.emit('test', data);
    })
}