const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getBoards, getBoard, updateBoard, deleteBoard, addBoard } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getBoards)
router.get('/:id', getBoard)
router.post('/', addBoard)
// router.put('/:id', requireAuth, updateBoard)
router.put('/:id', updateBoard)
// router.delete('/:id', requireAuth, deleteBoard)
router.delete('/:id', deleteBoard)

module.exports = router