const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const repo = require('../repositories/user.repo')
const _ = require("lodash");
const {generateAccessToken, generateRefreshToken} = require("../utils/tokens");
const knex = require("../db");


module.exports.createUserService = async (newUser) => {
    try {
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        const userId = await repo.createUserRepo(newUser);
        const accessToken = generateAccessToken({id: userId[0]});
        const refreshToken = generateRefreshToken({id: userId[0]});
        const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);

        await knex("refresh_tokens").insert({
            user_id: userId[0],
            refresh_token: refreshToken,
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.loginService = async (user) => {
    try {
        const userDb = await repo.loginRepo(user);

        const password = await bcrypt.compare(user.password, userDb.password);

        if (!password) {
            throw new Error('the password is not correct');
        }

        const accessToken = generateAccessToken({id: userDb.id });
        const refreshToken = generateRefreshToken({id: userDb.id});
        const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);

        await knex("refresh_tokens").insert({
            user_id: userDb.id,
            refresh_token: refreshToken,
        });

        return {'user': _.omit(userDb, 'password'), "accessToken" : accessToken, "refreshToken": refreshToken};
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.getUserservice = async (id)=>{
    try{
        const users = await repo.getUserRepo(id) ;
        return users;
    }catch (e){
        throw new Error(e.message);
    }
}

module.exports.getUsersInGroupservice = async (groupId)=>{
    try{
        const users = await repo.getUsersInGroupRepo(groupId) ;
        return users;
    }catch (e){
        throw new Error(e.message);
    }
}

module.exports.deleteUsersInGroupservice = async (groupId)=>{
    try{
        const users = await repo.deleteUsersInGroupRepo(groupId) ;
        return users;
    }catch (e){
        throw new Error(e.message);
    }
}

module.exports.addUserGroupservice = async (usersId,group_id,id)=>{
    try{
        return await repo.addUserGrouprepo(usersId,group_id,id);
    }catch (e){
        throw new Error(e.message);
    }
}

module.exports.askToJoinService = async (userId , groupId) => {
    try {
        return await repo.askToJoinRepo(userId,groupId);
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.acceptJoinRequestService = async (userId , groupId) => {
    try {
        return await repo.acceptJoinRequestRepo(userId,groupId);
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.getNotification = async (id) => {
    try {
        return await repo.getNotificationAdd(id);
    } catch (e) {
        throw new Error(e.message);
    }
}