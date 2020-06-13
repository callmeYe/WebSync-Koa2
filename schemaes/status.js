const mongoose = require('mongoose')

let io;

const broadcastTo = (room, msg, data) => {
    if (io) {
        io.to(room).emit(msg, data);
    }
}

let StatusSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    data: {
        type: Object,
        required: false,
    },
    lastModified: {
        type: Date,
        required: true
    },
});


StatusSchema.statics.setIO = function (socketIO) {
    io = socketIO;
}

StatusSchema.statics.updateStatus = function (status, data, callback) {
    this.update({
        name: status
    }, {
        name: status,
        data: data,
        lastModified: new Date()
    }, {
        upsert: true
    }).exec(function (err, res) {
        if (err) {
            return callback(err);
        } else {
            if (res.upserted) {
                Status.updateStatusList();
            }
            broadcastTo(status, status, data);
            return callback(null, {
                res: res,
                data: data
            });
        }
    });
}

StatusSchema.statics.updateStatusList = function () {
    this.find().exec(function (err, res) {
        if (err) {
            return callback(err);
        } else {
            var statusList = [];
            res.forEach(status => {
                statusList.push(status.name);
            });
            Status.updateStatus('statusList', {
                list: statusList
            }, function (err, res) {});
        }
    });
}
StatusSchema.statics.removeStatus = async function (status) {
    return await this.deleteOne({
        name: status
    })
}

let Status = mongoose.model('Status', StatusSchema);

module.exports = Status;