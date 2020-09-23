const boardService = require('./board.service')
const logger = require('../../services/logger.service')
const socketService = require('../socket/socket.service')

async function addBoard(req, res) {
    try {
        const board = req.body;
        await boardService.add(board)
        res.send(board)
    } catch (err) {
        logger.error('Cannot add board', err);
        res.status(500).send({ error: 'cannot add board' })
    }
}

async function getBoards(req, res) {
    try {
        const boards = await boardService.query(req.query)
        res.send(boards)
    } catch (err) {
        logger.error('Cannot get boards', err);
        res.status(500).send({ error: 'cannot get boards' })

    }
}

async function getBoard(req, res) {
    try {
        const board = await boardService.getById(req.params.id)
        res.send(board)
    } catch (err) {
        logger.error('Cannot get board', err);
        res.status(500).send({ error: 'cannot get board' })

    }
}

async function deleteBoard(req, res) {
    try {
        await boardService.remove(req.params.id)
        res.end()
    } catch (err) {
        logger.error('Cannot delete board', err);
        res.status(500).send({ error: 'cannot delete board' })

    }
}

async function updateBoard(req, res) {
    try {
        const board = req.body;
        const updatedBoard = await boardService.update(board)
        socketService.emitBoardUpdate(updatedBoard)
        res.send(board)
    } catch (err) {
        logger.error('Cannot update board', err);
        res.status(500).send({ error: 'cannot update board' })
    }
}

module.exports = {
    getBoards,
    getBoard,
    deleteBoard,
    updateBoard
}