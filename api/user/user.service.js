
const dbService = require('../../services/db.service')
const boardService = require('../board/board.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId


module.exports = {
    query,
    getById,
    getByEmail,
    remove,
    update,
    add,
    getUserDetails
}

async function getUserDetails(userId) {
    // compiling user report
    const boards = await boardService.queryWithMember({ 'members._id': userId })
    
    const userData = []
    const userActivities = []
    boards.forEach(board => {
        // create a minified data for any board the user is a member of
        const minifiedData = {
            board: {
                id: board._id,
                title: board.title,
                isArchived: board.isArchived,
                style: board.style
            },
            cards: [],
            groups: []
        }
        board.groups.forEach(group => {
            group.cards.forEach(card => {
                if (card.members) card.members.forEach(member => {
                    if (member._id === userId) {
                        // add the group and card details
                        minifiedData.groups.push({
                            title: group.title,
                            id: group.id,
                            archivedAt: group.archivedAt
                        })

                        minifiedData.cards.push({
                            title: card.title,
                            createdAt: card.createdAt,
                            description: card.description,
                            dueDate: card.dueDate,
                            id: card.id
                        })
                    }
                })
            })
        })

        if (board.activities.length) {
            board.activities.forEach(activity => {
                if (activity.byMember._id === userId) {
                    const activityData = {
                        board: {
                            id: board._id,
                            title: board.title,
                            isArchived: board.isArchived
                        },
                        activity: {
                            boardId: board._id,
                            createdAt: activity.createdAt,
                            txt: activity.txt,
                            commentTxt: activity.commentTxt,
                            id: activity.id,
                            byMember: {
                                id: userId,
                                fullName: activity.byMember.fullName,
                                imgUrl: activity.byMember.imgUrl
                            },
                            card: {
                                id: activity.card.id,
                                title: activity.card.title
                            }
                        }
                    }
                    userActivities.push(activityData)
                }
            })
            
        }
        // add it to the array
        userData.push(minifiedData)
    });
    return {userData,userActivities}
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('user')
    try {
        const users = await collection.find(criteria).toArray();
        // users.forEach(user => delete user.password);

        return users
    } catch (err) {
        console.log('ERROR: cannot find users')
        throw err;
    }
}

async function getById(userId) {

    console.log('HERE YOYO!', userId)

    const collection = await dbService.getCollection('user')
    try {
        const user = await collection.findOne({ "_id": ObjectId(userId) })
        delete user.password

        user.givenReviews = await reviewService.query({ byUserId: ObjectId(user._id) })
        user.givenReviews = user.givenReviews.map(review => {
            delete review.byUser
            return review
        })


        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${userId}`)
        throw err;
    }
}
async function getByEmail(userName) {
    const collection = await dbService.getCollection('user')
    try {
        const user = await collection.findOne({ userName })
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${email}`)
        throw err;
    }
}

async function remove(userId) {
    const collection = await dbService.getCollection('user')
    try {
        await collection.deleteOne({ "_id": ObjectId(userId) })
    } catch (err) {
        console.log(`ERROR: cannot remove user ${userId}`)
        throw err;
    }
}

async function update(user) {
    const collection = await dbService.getCollection('user')
    user._id = ObjectId(user._id);

    try {
        await collection.replaceOne({ "_id": user._id }, { $set: user })
        return user
    } catch (err) {
        console.log(`ERROR: cannot update user ${user._id}`)
        throw err;
    }
}

async function add(user) {
    const collection = await dbService.getCollection('user')
    try {
        await collection.insertOne(user);
        return user;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.txt) {
        criteria.username = filterBy.txt
    }
    if (filterBy.minBalance) {
        criteria.balance = { $gte: +filterBy.minBalance }
    }
    return criteria;
}


