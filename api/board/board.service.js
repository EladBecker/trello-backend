
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

const boardCollection = 'board'

async function query(filterBy = {}) {
    const collection = await dbService.getCollection(boardCollection)
    try {
        const boards = await collection.find(filterBy).toArray();
        // users.forEach(user => delete user.password);

        return boards
    } catch (err) {
        console.log('ERROR: cannot find boards')
        throw err;
    }
}

async function getById(boardId) {
    const collection = await dbService.getCollection(boardCollection)
    try {
        const board = await collection.findOne({ "_id": ObjectId(boardId) })
        return board
    } catch (err) {
        console.log(`ERROR: cannot find board ${boardId}`)
        throw err;
    }
}

async function remove(boardId) {
    const collection = await dbService.getCollection(boardCollection)
    try {
        await collection.deleteOne({ "_id": ObjectId(boardId) })
    } catch (err) {
        console.log(`ERROR: cannot remove board ${boardId}`)
        throw err;
    }
}

async function update(board) {
    const collection = await dbService.getCollection(boardCollection)
    board._id = ObjectId(board._id);
    try {
        await collection.replaceOne({ "_id": board._id }, board)
        return board
    } catch (err) {
        console.log(`ERROR: cannot update board ${board._id}`)
        throw err;
    }
}

async function add(board) {
    const collection = await dbService.getCollection(boardCollection)
    try {
        await collection.insertOne(board);
        return board;
    } catch (err) {
        console.log(`ERROR: cannot add board`)
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


