const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getTemplates, getTemplate, updateTemplate, deleteTemplate, addTemplate , createBoardFromTemplate} = require('./template.controller')

const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.post('/new/',createBoardFromTemplate)
router.get('/', getTemplates)
router.get('/:id', getTemplate)
router.post('/', addTemplate)
// router.put('/:id', requireAuth, updateBoard)
router.put('/:id', updateTemplate)
// router.delete('/:id', requireAuth, deleteBoard)
router.delete('/:id', deleteTemplate)

module.exports = router