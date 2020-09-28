
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    queryWithMember
}

const boardCollection = 'board'

async function queryWithMember(queryObj) {
    const collection = await dbService.getCollection(boardCollection)
    let boards = await collection.find(queryObj).toArray()
    return boards
}

async function query(query) {

    let filter = {}
    console.log(query.filter)
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


    // get collection
    const collection = await dbService.getCollection(boardCollection)

    // initialize
    let boards;

    // get collection size
    const boardSize = await collection.find({isArchived:false}).count()
    
    // get the board
    try {
        if (query.limit) {
            boards = await collection.find(filter).limit(query.limit * 1).skip(query.skip * 1).toArray();
        } else {
            boards = await collection.find(filter).toArray()
        }
        // users.forEach(user => delete user.password);

        return { boards, boardSize }
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


