const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const saltRounds = 10

async function login(email, password) {

    logger.debug(`auth.service - login with email: ${email}`)
    if (!email || !password) return Promise.reject('email and password are required!')
    const user = await userService.getByEmail(email)
    if (!user) return Promise.reject('Invalid email or password')

    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid email or password')
    console.log('USER:', user);

    delete user.password;
    return user;
}



async function signup(userName, password, fullName, imgUrl) {
    logger.debug(`auth.service - signup with userName: ${userName}, name: ${fullName}`)
    if (!userName || !password || !fullName) return Promise.reject('userName, name and password are required!')
    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({userName, password: hash, fullName, imgUrl})
}

module.exports = {
    signup,
    login,
}