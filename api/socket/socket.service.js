
module.exports = {
    connectSockets,
    emitBoardUpdate
};

let ioSocket = null;
function emitBoardUpdate(board) {
    ioSocket.to(board._id).emit('board-updated', board)
}
function connectSockets(io) {
    ioSocket = io;
    io.on('connection', socket => {
        socket.on('entered-board', boardId => {
            if (socket.currBoardId) {
                socket.leave(socket.currBoardId)
            }
            socket.join(boardId)
            socket.currBoardId = boardId;
            console.log(socket.currBoardId)
        })
    })
}