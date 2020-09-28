
const dbService = require('../../services/db.service')
const boardService = require('../board/board.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    createTemplateFromBoard,
    createBoardFromTemplate
}

const templateCollection = 'templates'
// if (!query) query.filterBy = {}

// const collection = await dbService.getCollection(boardCollection)
// let boards;
// try {
//     if (query.limit) {
//         boards = await collection.find(query.filterBy).limit(2).skip(0).toArray();
//     } else {
//         boards = await collection.find(query).toArray()
//     }
//     // users.forEach(user => delete user.password);

//     return boards
// } catch (err) {
//     console.log('ERROR: cannot find boards')
//     throw err;
// }

async function query(query) {
    
    let filter = {}
    if (query.filter) {
        // if query filter exists - parse it to an object
        query.filter = query.filter.substring(1)
        filter = JSON.parse('{"' + decodeURI(query.filter).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
        // if it has a bool as a string - turn it into a bool
        for (const key in filter) {
            if (filter[key] === 'true') filter[key] = true
            if (filter[key] === 'false') filter[key] = false
        }
    }

    const collection = await dbService.getCollection(templateCollection)
    let templates;
    const    templateSize = await collection.find(filter).count()
    try {
        if (query.limit) {
            templates = await collection.find(filter).limit(query.limit*1).skip(query.skip*1).toArray()
        } else { 
             templates = await collection.find(filter).toArray();
        }
        
        
        return {templates,templateSize}
    } catch (err) {
        console.log('ERROR: cannot find template')
        throw err;
    }
}

async function getById(templateId) {
    
    const collection = await dbService.getCollection(templateCollection)
    try {
        const template = await collection.findOne({ "_id": ObjectId(templateId) })
        return template
    } catch (err) {
        console.log(`ERROR: cannot find template ${template}`)
        throw err;
    }
}

async function remove(templateId) {
    const collection = await dbService.getCollection(templateCollection)
    try {
        await collection.deleteOne({ "_id": ObjectId(templateId) })
    } catch (err) {
        console.log(`ERROR: cannot remove template ${templateId}`)
        throw err;
    }
}

async function update(template) {
    const collection = await dbService.getCollection(templateCollection)
    template._id = ObjectId(template._id);
    try {
        await collection.replaceOne({ "_id": template._id }, template)
        return template
    } catch (err) {
        console.log(`ERROR: cannot update template ${template._id}`)
        throw err;
    }
}

async function add(template) {
    const collection = await dbService.getCollection(templateCollection)
    try {
        await collection.insertOne(template);
        return template;
    } catch (err) {
        console.log(`ERROR: cannot add template`)
        throw err;
    }
}

// function _buildCriteria(filterBy) {
//     const criteria = {};
//     if (filterBy.txt) {
//         criteria.username = filterBy.txt
//     }
//     if (filterBy.minBalance) {
//         criteria.balance = { $gte: +filterBy.minBalance }
//     }
//     return criteria;
// }

async function createBoardFromTemplate({templateId,user,boardName}) {
    
    const board = await getById(templateId)
    // remove the template id
    delete board._id

    // set the basics for the new board
    board.createdAt = Date.now()
    board.title = boardName
    board.createdBy = user
    board.members.push(user)
    
    // add the board
    await boardService.add(board)
    return board
}

async function createTemplateFromBoard({board,templateName,attachments,checklists,labels}) {
    console.log(templateName)
    return new Promise(async(resolve,reject) => {
        let template = JSON.parse(JSON.stringify(board))

        delete template._id

        template.createdAt = null
        template.members = []
        template.title = templateName
        
        template.createdBy = {}
        template.description = ''
        template.activities = []

        if (!labels) template.labels = []
        
        template.groups.forEach(group => group.cards.forEach(card => {
            delete card.timeAnalysis
            delete card.members

            card.byMember = {}
            card.dueDate = null
            
            card.id = makeId()

            if (!labels) card.labels = []
            if (!attachments) {
                card.attachments = []
                card.cover = null
            }
            if (!checklists) card.checklists = []
        }))
        await add(template)
        resolve(template)
    })

}

function makeId(length = 10) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}
