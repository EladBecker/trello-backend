const templateService = require('./template.service')
const logger = require('../../services/logger.service')


async function createBoardFromTemplate(req,res) {
    try {
        const data = req.body;
        console.log('create board from template',data)
        const board = await templateService.createBoardFromTemplate(data)
        res.send(board._id)
    } catch (err) {
        logger.error('Cannot create board', err);
        res.status(500).send({ error: 'cannot create board' })
    }
}

async function addTemplate(req, res) {
    try {
        const templateData = req.body;
        const template = await templateService.createTemplateFromBoard(templateData)
        res.send(template)
    } catch (err) {
        logger.error('Cannot add template', err);
        res.status(500).send({ error: 'cannot add template' })
    }
}

async function getTemplates(req, res) {
    
    try {
        const templates = await templateService.query(req.query)
        res.send(templates)
    } catch (err) {
        logger.error('Cannot get templates', err);
        res.status(500).send({ error: 'cannot get templates' })
    }
}

async function getTemplate(req, res) {
    try {
        const template = await templateService.getById(req.params.id)
        res.send(template)
    } catch (err) {
        logger.error('Cannot get template', err);
        res.status(500).send({ error: 'cannot get template' })

    }
}

async function deleteTemplate(req, res) {
    try {
        await templateService.remove(req.params.id)
        res.end()
    } catch (err) {
        logger.error('Cannot delete template', err);
        res.status(500).send({ error: 'cannot delete template' })

    }
}

async function updateTemplate(req, res) {
    try {
        const template = req.body;
        await templateService.update(template)
        res.send(template)
    } catch (err) {
        logger.error('Cannot update template', err);
        res.status(500).send({ error: 'cannot update template' })
    }
}

module.exports = {
    getTemplate,
    getTemplates,
    deleteTemplate,
    updateTemplate,
    addTemplate,
    createBoardFromTemplate
}